import json


def parse_keywords_file(file_path):
    # Dictionary to hold the final output
    output = []

    # Read and execute the keywords.py file
    with open(file_path, 'r', encoding='utf-8') as f:
        exec(f.read(), globals())

    # Process each keyword set in the globals()
    for key in globals():
        # Skip categories that end with '_ANTI'
        if key.endswith("_KEY_WORDS") and not key.endswith("_ANTI_KEY_WORDS"):
            category_name = key[:-len("_KEY_WORDS")]
            description = f"Courses related to {category_name.replace('_', ' ').lower()}."

            keywords_zh = globals().get(f"{category_name}_KEY_WORDS", [])
            anti_keywords_zh = globals().get(
                f"{category_name}_ANTI_KEY_WORDS", [])
            keywords_en = globals().get(f"{category_name}_KEY_WORDS_EN", [])
            anti_keywords_en = globals().get(
                f"{category_name}_ANTI_KEY_WORDS_EN", [])

            document = {
                "categoryName": category_name,
                "description": description,
                "keywords": {
                    "zh": keywords_zh,
                    "en": keywords_en,
                },
                "antiKeywords": {
                    "zh": anti_keywords_zh,
                    "en": anti_keywords_en,
                }
            }

            # Add the document to the output list
            output.append(document)

    return output


def save_to_json(data, output_file):
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    keywords_file_path = 'keywords.py'  # Path to your keywords.py file
    output_json_file = 'keywords_output.json'  # Output JSON file

    # Parse the keywords file and get the output
    keywords_data = parse_keywords_file(keywords_file_path)

    # Save the output to a JSON file
    save_to_json(keywords_data, output_json_file)

    print(f"Conversion complete! Output saved to {output_json_file}.")
