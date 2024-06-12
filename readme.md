# NER
Named-entity recognition is a subtask of information extraction that seeks to locate and classify named entities mentioned in unstructured text into pre-defined categories. For biomedical literature, NER is usally used for identification of gene names, diseases, organisms, cell types, etc. The NER process nowadays has been reshaped by natural language process (NLP) technology. 

This repository is to collect various tools and demonstrate how to use those tools for the identification of named entities in biological field. Most tools in thie repository are dependent on one or several large language models. We run API calls to use those models.

# [PubTator3](https://www.ncbi.nlm.nih.gov/research/pubtator3/api)
PubTator3 uses a high-performance entities search engine, to normalize different forms of the same entity into a unique standardized name to returned all matching articles. It is developed and maintained by NIH.

# Example
Here I use PubTator3 API to demonstrate how to extract entities from raw texts of OECD invitro test guidelines. Please refer to [this readme file](./PubTator3/Python/readme.txt) for more details.

## Data preparation
Text are extracted from search result from [OECD iLibrary](https://www.oecd-ilibrary.org/search?value1=in+vitro&option1=quicksearch&facetOptions=51&facetNames=pub_igoId_facet&operator51=AND&option51=pub_igoId_facet&value51=%27igo%2Foecd%27&publisherId=%2Fcontent%2Figo%2Foecd&searchType=quick) with the keyword: "in vitro". The descriotion of each in vitro test is processed from html texts and saved in txt files. in vitro test guidelines. For more details, please check [the scrapper notebook](./Scrapper/scrapper.ipynb).

## NER
The process consists two steps, the first is to submit your raw text and get the session number. The second step is to use this session number and retrieve data.

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