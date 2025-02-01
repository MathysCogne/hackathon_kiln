from afinn import Afinn
import sys
import json
import re
from datetime import datetime

TYPE_TO_FILENAME = {
    'ks': 'HdD_Kiln_Stats.txt',
    'ns': 'HdD_Networks_Stats.txt',
    'rd': 'HdD_Rewards.txt',
    'st': 'HdD_Stakes.txt',
    'ts': 'HdD_Transaction_Status.txt',
}

def extract_dates_and_eth(text, out_json):
    date_pattern = r'\b\d{4}-\d{2}-\d{2}\b'
    eth_pattern = r'\b0x[a-fA-F0-9]{40}\b'
    dates = re.findall(date_pattern, text)
    eth_addresses = re.findall(eth_pattern, text)
    date_objects = [datetime.strptime(date, '%Y-%m-%d') for date in dates]
    if date_objects:
        out_json['start_date'] = min(date_objects).strftime('%Y-%m-%d')
        if len(date_objects) > 1:
            out_json['end_date'] = max(date_objects).strftime('%Y-%m-%d')
        else:
            out_json['end_date'] = datetime.now().strftime('%Y-%m-%d')
    else:
        out_json['start_date'] = datetime.now().strftime('%Y-%m-%d')
        out_json['end_date'] = datetime.now().strftime('%Y-%m-%d')
    if eth_addresses:
        out_json['addr'] = eth_addresses[0]  # Assumant qu'il n'y a qu'une seule adresse, sinon vous pouvez gérer plusieurs adresses
    else:
        out_json['addr'] = ""

    return out_json

if len(sys.argv) != 2:
    print("Veuillez fournir une phrase ou un texte à analyser.")
    sys.exit(1)

keys = TYPE_TO_FILENAME.keys()
scores = {}  # Nouveau dictionnaire pour stocker les scores

for key in keys:
    afinn = Afinn(language=key)
    scores[key] = afinn.score(sys.argv[1])

# print(scores)
# yyyy-mm-dd
out_json = {}
if scores:
    max_score_key = max(scores, key=scores.get)
    out_json['call'] = max_score_key
    # Appeler la fonction extract_dates_and_eth ici avec l'argument de ligne de commande
    out_json = extract_dates_and_eth(sys.argv[1], out_json)  # Ajoutez cette ligne
    print(json.dumps(out_json))
else:
    print("Aucun score n'a pu être calculé.")
    sys.exit(1)  # Sortir du script si aucun score n'est calculé
