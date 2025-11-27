"""
AI Service for Resume Enhancement using Google Gemini API
Uses the free Gemini 1.5 Flash model
"""

import os
import requests
import json
from functools import lru_cache

# Get API key from environment
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')

# Use Gemini 1.5 Flash (free tier)
GEMINI_MODEL = 'gemini-1.5-flash'
GEMINI_API_URL = f'https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent'


def enhance_resume_text(text, section_type='general'):
    """
    Enhance resume text using Google Gemini AI
    
    Args:
        text (str): The original text to enhance
        section_type (str): Type of section (summary, experience, skills, education)
    
    Returns:
        str: Enhanced text, or original text if AI fails
    """
    if not GEMINI_API_KEY:
        print("⚠️ GEMINI_API_KEY not set, using fallback enhancement")
        return fallback_enhancement(text, section_type)
    
    try:
        prompt = get_enhancement_prompt(text, section_type)
        
        # Make request to Gemini API
        response = requests.post(
            f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
            headers={'Content-Type': 'application/json'},
            json={
                "contents": [{
                    "parts": [{
                        "text": prompt
                    }]
                }],
                "generationConfig": {
                    "temperature": 0.7,
                    "maxOutputTokens": 500,
                }
            },
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            enhanced_text = result['candidates'][0]['content']['parts'][0]['text'].strip()
            return enhanced_text
        else:
            print(f"Gemini API error: {response.status_code}")
            return fallback_enhancement(text, section_type)
            
    except Exception as e:
        print(f"AI enhancement error: {str(e)}")
        return fallback_enhancement(text, section_type)


def get_enhancement_prompt(text, section_type):
    """Generate appropriate prompt based on section type"""
    
    prompts = {
        'summary': f"""You are a professional resume writer. Enhance the following professional summary to make it more impactful and ATS-friendly. 
Use strong action verbs, quantify achievements where possible, and make it concise (2-3 sentences).
Keep the core message but make it more professional and compelling.

Original summary:
{text}

Enhanced summary (return ONLY the enhanced text, no explanations):""",
        
        'experience': f"""You are a professional resume writer. Enhance the following work experience description.
Use the STAR method (Situation, Task, Action, Result), strong action verbs, and quantify achievements.
Make it ATS-friendly and impactful.

Original:
{text}

Enhanced (return ONLY the enhanced text, no explanations):""",
        
        'skills': f"""You are a professional resume writer. Enhance the following skills section.
Organize skills by category if needed, use industry-standard terminology, and make it ATS-friendly.

Original:
{text}

Enhanced (return ONLY the enhanced text, no explanations):""",
        
        'general': f"""You are a professional resume writer. Enhance the following resume text to be more professional, impactful, and ATS-friendly.
Use strong action verbs and industry-standard terminology.

Original:
{text}

Enhanced (return ONLY the enhanced text, no explanations):"""
    }
    
    return prompts.get(section_type, prompts['general'])


def fallback_enhancement(text, section_type):
    """
    Fallback enhancement when AI is not available
    Applies basic improvements to the text
    """
    # Basic improvements
    enhanced = text.strip()
    
    # Add some professional polish based on section type
    if section_type == 'summary':
        # Ensure it starts with a strong descriptor
        if not any(enhanced.lower().startswith(word) for word in ['experienced', 'skilled', 'accomplished', 'dedicated', 'results-driven']):
            enhanced = f"Experienced {enhanced}"
    
    elif section_type == 'experience':
        # Ensure bullet points start with action verbs
        lines = enhanced.split('\n')
        action_verbs = ['Developed', 'Implemented', 'Managed', 'Led', 'Designed', 'Architected', 'Optimized', 'Collaborated']
        enhanced_lines = []
        for line in lines:
            line = line.strip()
            if line and not any(line.startswith(verb) for verb in action_verbs):
                # Try to add an action verb
                enhanced_lines.append(f"• {line}")
            else:
                enhanced_lines.append(line)
        enhanced = '\n'.join(enhanced_lines)
    
    return enhanced


# Cache enhancement results to reduce API calls
@lru_cache(maxsize=100)
def cached_enhance(text_hash, section_type):
    """Cached version of enhance_resume_text"""
    return enhance_resume_text(text_hash, section_type)
