# NER
Named-entity recognition is a subtask of information extraction that seeks to locate and classify named entities mentioned in unstructured text into pre-defined categories. For biomedical literature, NER is usally used for identification of gene names, diseases, organisms, cell types, etc. The NER process nowadays has been reshaped by natural language process (NLP) technology. 

This repository is to collect various tools and demonstrate how to use those tools for the identification of named entities in biological field. Most tools in thie repository are dependent on one or several large language models. We run API calls to use those models.

# [PubTator3](https://www.ncbi.nlm.nih.gov/research/pubtator3/api)
PubTator3 uses a high-performance entities search engine, to normalize different forms of the same entity into a unique standardized name to returned all matching articles. It is developed and maintained by NIH.

# Example: OECD in vitro testing guidelines
Here I use PubTator3 API to demonstrate how to extract entities from raw texts of OECD in vitro test guidelines, which are a set of internationally recognized protocols and standards designed to evaluate the safety and efficacy of chemicals, pharmaceuticals, and other substances using non-animal testing methods. I want to identify what cell lines and genes are used in each testing guideline.

## Data preparation
### Web scrapping
Text are extracted from search result from [OECD iLibrary](https://www.oecd-ilibrary.org/search?value1=in+vitro&option1=quicksearch&facetOptions=51&facetNames=pub_igoId_facet&operator51=AND&option51=pub_igoId_facet&value51=%27igo%2Foecd%27&publisherId=%2Fcontent%2Figo%2Foecd&searchType=quick) with the keyword: "in vitro". The descriotion of each in vitro test is processed from html texts and saved in txt files. For more details, please check [the scrapper notebook](./OECD/scrapper.ipynb).

### Formatting
The PubTator3 API requires txt file as input. I then save each testing guideline content as a txt file. Please check [the PubTator3 API data input process notebook](./OECD/generate_pubtator_input.ipynb).

## NER by PubTator3 API
The process consists two steps, the first is to submit your raw text and get the session number. The second step is to use this session number and retrieve data.

- Submit request:
```
cd ./PubTator3/
python SubmitText_request.py ../OECD/Pubtator_Input All SessionNumberFile.txt
```

- After a while (usually 5min), you can run the following code to retrieve data:
```
cd ./PubTator3/
python SubmitText_retrieve.py ../OECD/Pubtator_Input SessionNumberFile.txt ../OECD/Pubtator_Output/
```

## Summarization
Check the [summary notebook](./OECD/summarize.ipynb) for more details. After analysis, OECD in vitro testing guidelines contain 22 guidelines and cover 11 gene targets, with the use of 6 human cell lines.