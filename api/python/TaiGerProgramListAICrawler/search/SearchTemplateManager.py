# This files contains the search template for Duckduckgo or Serp earch
class SearchTemplateManager:
    '''
    - Keep the search template
    - Format template if needed
    - Format all templates
    '''

    def __init__(self):
        pass  # Currently, we do not have any instance variables to initialize, but this can change in the future.

    TEMPLATES = {
        "general_program_info": "{university_name} {program_name} {degree} introduction",
        "application_deadline": "{university_name} {program_name} {degree}'s application deadline",
        "required_document": "{university_name} {program_name} {degree}, which documents do i need to submit during the online application",
        "application_portal": "{university_name} {program_name} {degree}, where can i find the online application portal"
    }

    @classmethod
    def format_template(cls, template_key, university_name, program_name, degree):
        """format a sepectic tempalte"""
        template = cls.TEMPLATES.get(template_key)
        if not template:
            raise ValueError(f"No template found for key: {template_key}")
        return template.format(university_name=university_name, program_name=program_name, degree=degree)
    
    @classmethod
    def format_all_templates(cls, university_name, program_name, degree):
        """format all tempalte"""
        formatted_templates = []
        for tempates in cls.TEMPLATES.values():
            formatted_templates.append(tempates.format(university_name=university_name, program_name=program_name, degree=degree))

        if len(formatted_templates) != len(cls.TEMPLATES):
            raise ValueError(f"formmated template length is incorrect")
        
        return formatted_templates


    @classmethod
    def num_templates(cls):
        """Return the number of available templates."""
        return len(cls.TEMPLATES)

#--------

# Example usage:
#manager = SearchTemplateManager() # no need
#print(SearchTemplateManager.format_template("general_program_info", "Harvard", "Computer Science", "Masters"))
#print(SearchTemplateManager.format_all_templates("Harvard", "Computer Science", "Masters"))
#print(SearchTemplateManager.num_templates())
