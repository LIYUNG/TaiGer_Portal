from langchain.output_parsers import ResponseSchema
from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime

# 1. Base Info
class ProgramBaseInfo(BaseModel):
    university_name: str                = Field(description='This is the name of the university')
    program_name: str                   = Field(description='This is the name of the program')
    degree: str                         = Field(description='what are the type of degree?  Bachelor of Arts, Bachelor of Science, Master of Arts, Master of Science, Master of Business Administration')
    country: str                        = Field(description='This is the country of this university')
    tuition_fee: Optional[str]               = Field(description='This describes the tuition fee of this program per semester')


# 2. Application period
class ApplicationPeriod(BaseModel):
    semester: str                       = Field(description='if this program only has winster semester for application output "WS", if ony summer semester, output "SS", if both are exist, output "Both"')
    winter_semester_application_start: str                   = Field(description='When is "starting date" of the "winter semester" application?')
    winter_semester_application_deadline: str                = Field(description='When is the "deadline" of the "winter semester application"?')
    summer_semester_application_start: Optional[str]                   = Field(description='When is "starting date" of the "summer semester" application?')
    summer_semester_application_deadline: Optional[str]                = Field(description='When is the "deadline" of the "winter semester" application?')


# 3. ML, RL, Essay, Supplementary
class RequiredDocument(BaseModel):
    ml_required: str                    = Field(description='This describes whether this programs requires Motiviation letter for application, provide yes, no, unknown')
    ml_requirement: Optional[str]                 = Field(description='This describes the detailed requirement for the motivation letter e.g. number of words')
    rl_required: str                    = Field(description='This describes whether this programs requires Recommendation letter for application, provide yes, no, unknown')
    rl_requirement: Optional[str]                 = Field(description='This describes the detailed requirement for the Recommendation letter e.g. how many recommendation letters are required?')
    essay_required: str                 = Field(description='This describes whether this programs requires Scientific essay for application, provide yes, no, unknown')
    essay_requirement: Optional[str]              = Field(description='This describes the detailed requirement for the Scientific essay e.g. what is the topic? how many words is required?')
    supplementary_form_required: str    = Field(description='This describes whether this programs requires any supplementary form for application, provide yes, no, unknown')
    supplementary_form_requirement: Optional[str] = Field(description='This describes the detailed requirement for the supplementary form')

# 4. Language
class RequiredLanguage(BaseModel):
    language: Optional[str]                       = Field(description='This describe the official teaching language for this program')
    toefl: Optional[str]                          = Field(description="what is the required TOEFL score for applying this program? Please provide the score")
    ielts: Optional[str]                          = Field(description="what is the required IELTS score for applying this program? Please provide the score")
    gre: Optional[str]                            = Field(description='If this program needs GRE score, what is required GRE score for applying this program? Please provide the score')
    gmat: Optional[str]                           = Field(description='If this program needs GMAT score, what is the required score for applying this program? Please provide the score')
    testdaf: Optional[str]                        = Field(description='If this program is taught in German, this is the required TESTDAF score for applying this program Please provide the score')


# 5. Academic Performance
class RequiredAcademicPerf(BaseModel):
    gpa: Optional[str]            = Field(description='This describes the required overall GPA or previous academic performance to apply for this program, please be as detailed as possible , not just the number')
    ects: Optional[str]           = Field(description='This describes required ECTS in any field to apply for this program, please be as detailed as possible e.g. required 30 ECTs in mathmetics, required 8 ECTs in Computer architecture')


# 6. URLs
class UrlLinks(BaseModel):
    application_portal_a: Optional[str]           = Field(description='This describes the url link to the application portal for applying this program')
    website: Optional[str]                        = Field(description='This describes the url link to the website of this program')
    fpso: Optional[str]                           = Field(description='This describes the url link to the Fachprüfungs- und Studienordnung (FPSO) of this program')
    contact: Optional[str]                        = Field(description='This describes the contact email link if have any questions')