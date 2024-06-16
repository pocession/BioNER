import requests
import json
from collections import Counter
import csv

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


