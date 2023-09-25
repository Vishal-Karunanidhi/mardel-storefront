# Hobby Lobby NextGen Website

## Setup

Create an `.env` file with following variables:
| Variable Name | Data Type | Example value [^1] |
| ------ | ------ | ------ |
| ALLOWED_DOMAINS | string array | `["hobbylobby.com","docs.hobbylobby.com"]` |
| NEXT_PUBLIC_ALGOLIA_API_KEY | GUID | |
| NEXT_PUBLIC_ALGOLIA_APP_ID | string | |
| NEXT_PUBLIC_ALGOLIA_INDEX_NAME | string | |
| NEXT_PUBLIC_ALGOLIA_PROXY | string, URL | |
| NEXT_PUBLIC_ALGOLIA_REPLICA_NAME_ASC_INDEX_NAME | string | |
| NEXT_PUBLIC_ALGOLIA_REPLICA_NAME_DESC_INDEX_NAME | string | |
| NEXT_PUBLIC_ALGOLIA_REPLICA_NEW_ASC_INDEX_NAME | string | |
| NEXT_PUBLIC_ALGOLIA_REPLICA_PRICE_ASC_INDEX_NAME | string | |
| NEXT_PUBLIC_ALGOLIA_REPLICA_PRICE_DESC_INDEX_NAME | string | |
| NEXT_PUBLIC_ALGOLIA_REPLICA_VARIANT_PRICE_ASC_INDEX_NAME | string | |
| NEXT_PUBLIC_ALGOLIA_REPLICA_VARIANT_PRICE_DESC_INDEX_NAME | string | |
| NEXT_PUBLIC_ALGOLIA_DIY_INDEX_REPLICA_DATE_ASC | string | |
| NEXT_PUBLIC_ALGOLIA_DIY_INDEX_REPLICA_DATE_DESC | string | |
| NEXT_PUBLIC_ALGOLIA_QUERY_SUGGESTIONS_INDEX_NAME | string | |
| NEXT_PUBLIC_ANONYMOUS_ID_COOKIE_NAME | string | |
| NEXT_PUBLIC_BAG_ID_COOKIE_NAME | string | |
| NEXT_PUBLIC_BFF_URI | string, URL | |
| NEXT_PUBLIC_FALLBACK_IMAGE | string, URL | |
| NODE_ENV | string | `production` or `development` |
| ONETRUST_KEY | string | |
| NEXT_PUBLIC_RECAPTCHA_SITE_KEY | string | |
| NEXT_PUBLIC_GOOGLE_RECAPTCHA_V3_END_POINT | string, URL | |
| NEXT_PUBLIC_ALGOLIA_DIY_INDEX_NAME | string | HLNextGenEcommDIYIndex_snd_diy |
| NEXT_PUBLIC_PAYPAL_CURRENCY | string | USD |
| NEXT_PUBLIC_PAYPAL_INTENT | string | authorize |
| NEXT_PUBLIC_PAYPAL_SDK_LIB | string | https://www.paypal.com/sdk/js |
| NEXT_PUBLIC_PAYPAL_SDK_CLIENT_ID | string | |
| COOKIE_DOMAIN | string | .hobbylobby.com |
| NEXT_PUBLIC_PAYPAL_PAYLATER_THRESHOLD | number | 30 |
| NEXT_PUBLIC_SESSION_RESPONSE_HEADER | number | hl-session-data |

Values are intentionally not shown in this document to avoid any possibility of accidental sensitive information leak. Values can be retrieved through the Secret Server entry or requesting the information from a manager. Some values may not be in use and may be omitted.

[^1]: used for illustrative purposes only. Example data may not be appropriate or correct.

_Remove the below after integration_

### Product Details Page GraphQL Details,

```
import { getVariantInventoryDetails, getProductPageContentAndData } from '@Lib/cms/productDetailsPage';
```

### Returns PDP CMS data & Product Details from CT

```
const payload = { key: "40PET21", isStaged: true };
const productContentAndData = await getProductPageContentAndData(payload);
```

### Returns Inventory info for the variants

```
const variantKeys = ["100124", "418053", "6856", "98764"]
const variantInventoryData = await getVariantInventoryDetails(variantKeys);
```

### Returns Breadcrumbs and Amplience content for Category List Page

```
const deliveryKey: String = 'Home-Decor-Frames/Candles-Fragrance/c/05-126';
const categoryKey: String = '05-126';
const categoryListPageData = await getCategoryListPageData(categoryKey, deliveryKey);
```

## Docker setup

The nextgen storefront uses Docker to simplify the process of starting this project.
This makes it quick, easy, and painless to get the server up and running.
Once Docker is setup on your machine, all you need is one simple command in your terminal or command propt to start working.
Installing Docker will also apply to the development process detailed below.

- Docker: You will need Docker installed for your particular OS.

  - Windows:
    - [Docker Desktop](https://www.docker.com/products/docker-desktop)
    - [Windows Subsystem for Linux (WSL)](https://docs.microsoft.com/en-us/windows/wsl/install#install-wsl-command)
    - [WSL 2 back-end](https://docs.docker.com/docker-for-windows/wsl/)
  - macOS:
    - [Docker Desktop](https://www.docker.com/products/docker-desktop)
  - Linux:
    - [Docker CE/EE](https://docs.docker.com/install/#supported-platforms)
    - [Docker Compose](https://docs.docker.com/compose/install)

### Start the server with Docker

#### MacOS

1. Open [Terminal](<https://support.apple.com/guide/terminal/open-or-quit-terminal-apd5265185d-f365-44cb-8b09-71a064a42125/2.12/mac/11.0#:~:text=by%20the%20tilde%20(~).-,Open%20Terminal,-On%20your%20Mac>)
2. Navigate to the root directory of this prjoect
3. Copy and paste the following into the terminal: `docker compose up`

#### Windows

1. Open [Command Prompt](https://www.dell.com/support/kbdoc/en-in/000130703/the-command-prompt-what-it-is-and-how-to-use-it-on-a-dell-system#:~:text=How%20to%20Open%20the%20Command%20Prompt)
2. Navigate to the root directory of this prjoect
3. Copy and paste the following into the command prompt: `docker compose up`

#### Developing Inside A Container

The nextgen storefront uses a Remote Container for development.
All development is done within a contained and consistent environment.
As long as you have [Docker](#docker-setup) and the few simple tools listed below installed, you can begin right away.

- [Visual Studio Code](https://code.visualstudio.com/)
- [Remote Development Extension](https://aka.ms/vscode-remote/download/extension)

### Once you have all of the tools installed, follow these instructions to get it running:

1. Clone the [repo](https://github.com/hobbylobbystores/hl-nextgen-storefront) through GitHub
2. Open project in VSCode
3. Open the Command Palette (F1) and search for the option `Remote-Containers: Reopen in Container` and select it
   - Please rebuild if prompted to do so
4. Run `npm run dev` inside of the terminal as usual to get your server going
5. **That's it!**

If you would like more informaton or details on remote containers, [check out the docs](https://code.visualstudio.com/docs/remote/containers).

## Cart Testing

1. Please install Firefox-plugin: `cookie-editor` or Chrome: `EditThisCookie` addons/extension.
2. create a cookie named `hobbylobby-cart` and set the `cart-id` value
   Ex: `03861efa-8047-47ad-a7fc-1362a5cdab7e` or `81541cf0-3d95-42af-af15-d0f5f36ab0f2` or `4c8d8611-981c-4bb3-a144-60d876ade694`
3. Select `hostonly` and `secure` checkboxes and set expiration date to 1 day from now.


## M2 Docker Install for local use
1. From the docker-desktop page (https://www.docker.com/products/docker-desktop/) click the
    Apple Chip link
2. After docker has downloaded and had been move to your Applications, git clone the following repo 
  (https://hlgithub.hobbylobby.corp/balower1/nginx-local-proxy.git)
3. Once inside the repo run: `docker pull nginx`
4. cd to hl-node-proxy/
5. List all the servers by running: `ls servers*`
6. The output should your server.crt and server.key
7. Open a new terminal and cd to nginx-local-proxy/
8. Copy the servers from the hl-node-proxy repo by running: `cp ../hl-node-proxy/server.* .`
9. Run ls to make sure that both certs are included in the repo
10. Run `./buildNrestart.sh`
11. In a new terminal cd/open hl-nextgen-storefront and hl-node-proxy
12. Run `npm run dev` for both


