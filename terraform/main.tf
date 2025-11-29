provider "aws" {
  region = "ap-south-1" # Mumbai region for India
}

# VPC
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  tags = { Name = "jobsaathi-vpc" }
}

# Subnets (Simplified for example)
resource "aws_subnet" "public" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]
}

# Security Groups
resource "aws_security_group" "lb" {
  name        = "jobsaathi-lb-sg"
  description = "Allow HTTP inbound traffic"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "jobsaathi-cluster"
}

# RDS PostgreSQL
resource "aws_db_instance" "postgres" {
  identifier              = "jobsaathi-db"
  engine                  = "postgres"
  engine_version          = "15.3"
  instance_class          = "db.t3.medium"
  allocated_storage       = 100
  storage_type            = "gp3"
  db_name                 = "jobsaathi"
  username                = var.db_username
  password                = var.db_password
  backup_retention_period = 7
  multi_az                = true
  tags = { Name = "jobsaathi-database" }
}

# ElastiCache Redis
resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "jobsaathi-redis"
  engine               = "redis"
  node_type            = "cache.t3.medium"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379
}

# S3 Bucket for resumes
resource "aws_s3_bucket" "resumes" {
  bucket = "jobsaathi-resumes"
  tags = { Name = "Resume Storage" }
}

# CloudFront CDN
resource "aws_cloudfront_distribution" "cdn" {
  origin {
    domain_name = aws_s3_bucket.resumes.bucket_regional_domain_name
    origin_id   = "S3-resumes"
  }

  enabled             = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-resumes"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

# Load Balancer
resource "aws_lb" "main" {
  name               = "jobsaathi-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.lb.id]
  subnets            = aws_subnet.public.*.id
}

# Auto Scaling
resource "aws_appautoscaling_target" "ecs_target" {
  max_capacity       = 10
  min_capacity       = 2
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.main.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "ecs_policy" {
  name               = "cpu-scaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.ecs_target.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs_target.scalable_dimension
  service_namespace  = aws_appautoscaling_target.ecs_target.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value = 70.0
  }
}

# Variables
variable "db_username" {}
variable "db_password" {}

# Data Sources
data "aws_availability_zones" "available" {}
