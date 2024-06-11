# NER
Named-entity recognition is a subtask of information extraction that seeks to locate and classify named entities mentioned in unstructured text into pre-defined categories. For biomedical literature, NER is usally used for identification of gene names, diseases, organisms, cell types, etc. 

This repository is to collect various tools and demonstrate how to use those tools to identify named entities in biological field. The NER process nowadays has been reshaped by natural language process (NLP) technology. Therefore, most tools in thie repository are dependent on one or several large language model. We will run API calls to use those models.

# [PubTator3](https://www.ncbi.nlm.nih.gov/research/pubtator3/api)
PubTator3 uses a high-performance entities search engine, to normalize different forms of the same entity into a unique standardized name to returned all matching articles. It is developed and maintained by NIH.

## Example
Here I use PubTator3 API to demonstrate how to extract entities from raw texts of OECD invitro test guidelines. Please refer to [this readme file](./PubTator3/Python/readme.txt) for more details.

The process consists two steps, the first is to submit your raw text and get the session number. The second step is to use this session number to retrieve your data.

- Submit request:
```
cd ./PubTator3/Python
python SubmitText_request.py ../../OECD "Gene" SessionNumberFile.txt
```

- Retrieve data:
```
cd ./PubTator3/Python
python SubmitText_retrieve.py ../../OECD SessionNumberFile.txt ./output/
```