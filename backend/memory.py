import os
from dotenv import load_dotenv
from pinecone import Pinecone
from langchain_pinecone import PineconeVectorStore
from langchain_huggingface import HuggingFaceEmbeddings

load_dotenv()

# text -> embedding -> vector store -> search 
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-mpnet-base-v2"
)


pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index("research-memory")

vector_store = PineconeVectorStore(
    index=index,
    embedding=embeddings,
)

def save_to_memory(text:str , metadata:dict):
    vector_store.add_texts(texts=[text], metadatas=[metadata])


def search_memory(query:str, k:int = 3):
    results = vector_store.similarity_search(query, k=k)
    return results
