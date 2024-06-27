import requests
import json
from collections import Counter
import csv
import time

def get_relation_data(e1_id, relation_type, e2, output_path):
    # Construct the URL for API call
    retrieve_url = f'https://www.ncbi.nlm.nih.gov/research/pubtator3-api/relations?e1={e1_id}&type={relation_type}&e2={e2}'

    # Initialize an empty list to store results
    results = []

    # API call to retrieve data
    response = requests.get(retrieve_url)

    if response.status_code == 200:
        # Parse the JSON response
        data = json.loads(response.text)
        results.append(data)
    else:
        print("No response!")  # Print a message if API call fails
    
    time.sleep(0.3)

    # Initialize variables to store targets and count unique targets
    targets = []
    unique_targets = set()

    # Iterate through each entry in the retrieved data
    for entry in data:
        target = entry.get('target')
        relation = entry.get('type')  # Assuming 'type' field represents the relation type
        publications = entry.get('publications')
        
        # Store target, relation, and publications in the targets list
        targets.append((target, relation, publications))
        
        # Add target to unique_targets set to ensure uniqueness
        unique_targets.add(target)

    # Print number of unique targets
    print(f"Number of unique targets: {len(unique_targets)}")

    # Save extracted data to CSV file

    # Extract disease name from the first entry in data (assuming it exists)
    first_entry = data[0] if data else {}
    disease_source = first_entry.get('source', '')  # Get the source field, defaulting to an empty string if not found

    # Extract disease name without '@DISEASE_' prefix
    disease_name = disease_source.replace('@DISEASE_', '')

    # Define the output CSV file path using disease_name and output_path
    csv_file = output_path + f'{disease_name}.csv'

    # Sort targets based on publications count (descending order)
    sorted_targets = sorted(targets, key=lambda x: x[2], reverse=True)

    # Write to CSV file
    with open(csv_file, mode='w', newline='') as file:
        writer = csv.writer(file)
        
        # Write header row
        writer.writerow(['Target', 'Relation', 'Publications'])
        
        # Write data rows
        for target, relation, publications in sorted_targets:
            writer.writerow([target, relation, publications])

    print(f"Data has been saved to {csv_file}.")  # Print confirmation message after saving

# Example usage:
# get_relation_data('e1_id_value', 'relation_type_value', 'e2_value', '/path/to/output/')

def get_disease_data(total_page, e1, e2, output_path):
    """
    Retrieve disease data related to specified entities from PubTator and save to a CSV file.

    Args:
    total_page (int): Total number of pages to retrieve from the API.
    e1 (str): The first entity (typically a chemical) to search for in relations.
    e2 (str): The second entity (typically a disease) to search for in relations.
    output_path (str): The directory path where the output CSV file will be saved.
    """
    
    # The first entity ID with '@CHEMICAL_' prefix
    e1_id = '@CHEMICAL_' + e1
    
    # The type of relation to search for
    relation_type = 'ANY'
    
    # List to store filtered results
    filtered_data = []
    
    # The second entity with '@' prefix
    entity = '@' + e2 + '_'
    
    # Loop through each page to retrieve data
    for page in range(total_page):
        # Construct the URL for the API call
        retrieve_url = f'https://www.ncbi.nlm.nih.gov/research/pubtator3-api/search/?text=relations:{relation_type}%7C{e1_id}%7C{e2}&page={page+1}'

        # Make the API call
        response = requests.get(retrieve_url)
        # Parse the JSON response
        data = json.loads(response.text)
        
        # Pause to avoid hitting the API rate limit
        time.sleep(0.3)
        
        # Iterate through the results
        for result in data['results']:
            # Highlighted text from the result
            text_hl = result.get('text_hl', '')
            
            # Check if the highlighted text contains the entity
            if entity in text_hl:
                # PubMed ID
                pmid = result.get('pmid')
                # Title of the article
                title = result.get('title')
                # Append the filtered result to the list
                filtered_data.append({
                    'pmid': pmid,
                    'title': title,
                    'text_hl': text_hl
                })

    # Define the CSV file name based on entities
    csv_file = output_path + e1.lower() + '_' + e2.lower() + '.csv'

    # Write the filtered data to the CSV file
    with open(csv_file, mode='w', newline='') as file:
        # Create a CSV DictWriter object
        writer = csv.DictWriter(file, fieldnames=['pmid', 'title', 'text_hl'])
        # Write the header to the CSV file
        writer.writeheader()
        # Write the rows to the CSV file
        writer.writerows(filtered_data)

    # Print a confirmation message
    print(f"Data has been written to {csv_file}")

# Example usage
# get_disease_data(total_page, e1, e2, '/path/to/output/')