# AMRIT - Mother And Child Tracking System (MCTS) Service

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)  ![branch parameter](https://github.com/PSMRI/HelplineMCTS-UI/actions/workflows/sast-and-package.yml/badge.svg)

The AMRIT - Mother And Child Tracking System (MCTS) Service is a comprehensive application designed to provide counseling and care to mothers and their children from the early stages of pregnancy until the child turns one year old. The primary objective of the MCTS Service is to ensure the well-being and health of both the mother and child during this critical period. 

## Features

- **Counseling and Care:** The MCTS Service offers a range of counseling and care services to beneficiaries and their families. These services are aimed at promoting maternal and child health, addressing any concerns or issues, and providing necessary guidance and support.

- **Beneficiary Management:** The MCTS Service allows for efficient management of beneficiaries and their records. Beneficiary data is sourced from the Reproductive and Child Health (RCH) portal, which serves as a central repository for mother and child information. The MCTS Service enables seamless integration with the RCH portal to retrieve and update beneficiary records.

- **Role-based Access:** The MCTS Service involves three key roles: Auxiliary Nurse Midwife (ANM), Medical Officer (MO), and Supervisor. Each role has specific responsibilities and access privileges within the system. ANMs and MOs are responsible for making outbound calls to beneficiaries, while Supervisors allocate beneficiary lists and oversee the overall operations.

- **Configurable Call Settings:** The MCTS Service allows for flexible configuration of call parameters. Supervisors can define the number of calls a beneficiary should receive within a specific duration. This feature ensures that beneficiaries receive the appropriate counseling and care based on program norms and guidelines.

- **Antenatal and Postnatal Calls:** The MCTS Service supports two types of calls: Antenatal Care (ANC) calls and Postnatal Care (PNC) calls. ANC calls are made before delivery to provide essential care and support during pregnancy, while PNC calls are made after delivery to monitor the well-being of both mother and child.

## Building from source

To build the HelplineMCTS microservice from source, follow these steps:

### Prerequisites

Ensure that the following prerequisites are met before building the MMU service:

* JDK 1.8
* Maven
* NPM/YARN
* Spring Boot v2
* MySQL

### Installation

To install the MCTS module, please follow these steps:

1. Clone the repository to your local machine.
2. Install the dependencies and build the module:
   - Run the command `npm install`.
   - Run the command `npm run build`.
   - Run the command `mvn clean install`.
   - Run the command `npm start`.
3. Open your browser and access `http://localhost:4200/#/login` to view the login page of module.

## Usage

All the features of the HelplineMCTS service are exposed as REST endpoints. Refer to the Swagger API documentation for detailed information on how to use the service and interact with its functionalities.

The AMRIT HelplineMCTS module provides a comprehensive solution for managing various aspects of your application.



<!-- # Iemrdash

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
-->
