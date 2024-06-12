# 📘 How to install azure command line

https://learn.microsoft.com/en-us/cli/azure/install-azure-cli-windows?tabs=azure-cli
In the Latest version section, select the bit of the OS you are using and download it.


## 👋🏻 AZURE_APP_SERVICE_NAME
Create an App Service in the Azure Portal and record the name.

## 👋🏻 AZURE_CREDENTIALS

Start the command prompt and execute the following command

az login

az ad sp create-for-rbac --name "Azure ChatGPT Production" --role contributor --scopes /subscriptions/{SUBSCRIPTION_ID}/resourceGroups/{RESOURCE_GROUP} --sdk-auth --output json

## 👋🏻 Building each service on Azure
CosmosDB
AI-Search
Bing
Document Intelligence

## Run Github Actions
Actions->Build & Deploy Nextjs ... -> Run Workflow -> run workflow


## 👋🏻 Change the Azure App Service settings
OPENAI_API_KEY=
AZURE_OPENAI_API_INSTANCE_NAME=
AZURE_OPENAI_API_DEPLOYMENT_NAME=
AZURE_OPENAI_API_VERSION=2023-03-15-preview
AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME=
ADMIN_EMAIL_ADDRESS="you@email.com,you2@email.com"
AZURE_AD_CLIENT_ID=
AZURE_AD_CLIENT_SECRET=
AZURE_AD_TENANT_ID=
NEXTAUTH_SECRET=AZURE-OPENIAI-NEXTAUTH-OWNKEY@1
AZURE_COSMOSDB_URI=https://<cosmoresourcename>.documents.azure.com:443/
AZURE_COSMOSDB_KEY=
AZURE_COSMOSDB_DB_NAME=chat
AZURE_COSMOSDB_CONTAINER_NAME=history
AZURE_SEARCH_API_KEY=
AZURE_SEARCH_NAME=
AZURE_SEARCH_INDEX_NAME=
AZURE_SEARCH_API_VERSION="2023-07-01-Preview"
AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT="https://NAME.api.cognitive.microsoft.com/"
AZURE_DOCUMENT_INTELLIGENCE_KEY=
AZURE_BINGSEARCH_API_KEY=

## 👋🏻 Change Azure Entra settings
Azure Entra -> AzureChatGPTProduction

Create Redirect URI 
https://{Your Host}.azurewebsites.net/api/auth/callback/azure-ad