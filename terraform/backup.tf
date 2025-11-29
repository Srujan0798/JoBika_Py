# S3 Versioning for resume storage
resource "aws_s3_bucket_versioning" "resumes" {
  bucket = aws_s3_bucket.resumes.id
  
  versioning_configuration {
    status = "Enabled"
  }
}

# Lifecycle policy
resource "aws_s3_bucket_lifecycle_configuration" "resumes" {
  bucket = aws_s3_bucket.resumes.id
  
  rule {
    id     = "archive-old-versions"
    status = "Enabled"
    
    noncurrent_version_transition {
      noncurrent_days = 30
      storage_class   = "GLACIER"
    }
    
    noncurrent_version_expiration {
      noncurrent_days = 365
    }
  }
}

# Note: RDS automated backups are configured in the aws_db_instance resource in main.tf.
# This file can contain additional backup resources like AWS Backup plans.

resource "aws_backup_vault" "main" {
  name = "jobsaathi-backup-vault"
}

resource "aws_backup_plan" "main" {
  name = "jobsaathi-backup-plan"

  rule {
    rule_name         = "daily_backup"
    target_vault_name = aws_backup_vault.main.name
    schedule          = "cron(0 3 * * ? *)" # Daily at 3 AM
    lifecycle {
      delete_after = 30
    }
  }
}

resource "aws_backup_selection" "main" {
  iam_role_arn = aws_iam_role.backup.arn
  name         = "jobsaathi-backup-selection"
  plan_id      = aws_backup_plan.main.id

  resources = [
    aws_db_instance.postgres.arn,
    aws_s3_bucket.resumes.arn
  ]
}

resource "aws_iam_role" "backup" {
  name               = "jobsaathi-backup-role"
  assume_role_policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": ["sts:AssumeRole"],
      "Effect": "Allow",
      "Principal": {
        "Service": ["backup.amazonaws.com"]
      }
    }
  ]
}
POLICY
}

resource "aws_iam_role_policy_attachment" "backup" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSBackupServiceRolePolicyForBackup"
  role       = aws_iam_role.backup.name
}
