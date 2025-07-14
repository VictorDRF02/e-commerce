# e-commerce

This is an online store project made with Angular version 18.2.20 as framework and tailwindcss 3 as css library.

## Table of contents

- [Installation](#installation)
- [Development server](#development-server)
- [Usage](#usage)
- [Development](#development)

## Installation

Clone the repository and install:

```bash
git clone https://github.com/VictorDRF02/e-commerce
cd e-commerce
```

Install the dependencies:

```bash
npm install
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Usage

After running the development server, you can access the application at `http://localhost:4200/`.

The application is divided into different views:

- Products: Displays a list of products with their details and a cart icon. Route: `/`.
- Product Details: Displays the details of a specific product. Route: `/product/:id`.
- Search: Displays a search form with filters for the products. Route: `/search`.
- Login: Displays the login form for the user to access their account. Route: `/login`.
- Account: Displays the user's account information. Route: `/account`. You need authentication to access this route.
- Payment: Displays the payment form for the user to complete the order. Route: `/payment`. You need authentication to access this route.

### Authentication

In the `login` form you can use the following credentials:

- Username: `johnd`
- Password: `m38rmF$`

An alternative option is:

- Username: `kevinryan`
- Password: `kev02937@`

## Development

In case you want to edit the project locally you can clone the repository and make pull requests to the `main` branch.

### Prerequisites

Before you start, make sure you have the following installed:

- [Node.js](https://nodejs.org/en/) (v18.2.0 or higher)
- [Angular CLI](https://angular.io/cli) (v18.2.0 or higher)
- [Git](https://git-scm.com/downloads)

### Generate files

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
