# Live Technical Challenge: Implementing Domain Logic in a Serverless Service

This is a 60-minute, hands-on coding and infrastructure modification session. You will be expected to get a local cloud environment running, implement the core business logic and eventing, and verify your changes.

## Objective

Your goal is to implement the domain logic for a new product ingestion service by orchestrating calls to a pre-existing data layer. The challenge also covers robust error handling, event-driven integration, and unit testing.

## Prerequisites

-   Node.js (v18 or later)
-   Terraform (v1.5 or later)
-   Docker and Docker Compose

## Getting Started

1.  **Start the local environment:**
    ```sh
    make up
    ```
2.  **Install dependencies:**
    ```sh
    npm install
    ```
3.  **Deploy the initial infrastructure:**
    ```sh
    make apply
    ```
4.  **Run the existing tests:**
    ```sh
    make test
    ```
5.  Review the code, especially `/src/index.ts` (where you will work) and `/src/product.repository.ts` (which you will use).

## Scenario

We have a service for ingesting new product data. The infrastructure and data layer are already built. Your mission is to implement the core domain logic in the Lambda handler. You'll need to add validation, use the provided repository to process and save product data, and finally, publish an event to notify other systems.

---

## Tasks

### Task 1: Add Input Validation and Error Handling

Ensure the service is robust and handles bad data correctly.

1.  **Modify the Lambda Function (`/src/index.ts`):** Add validation logic. A product message is only valid if it contains a `productName` and a `price` greater than 0.
2.  **Implement the DLQ:** If a message fails validation, it should be moved to a Dead-Letter Queue (DLQ).
    -   **Modify the Terraform code (`/terraform/main.tf`):** Create a new SQS queue to serve as the DLQ and configure the `product-ingestion-queue` to use it.

### Task 2: Implement the Core Domain Logic

Using the provided repository, orchestrate the business logic for creating a new product.

1.  **Use the Product Repository (`/src/product.repository.ts`):** This file handles all database work.
2.  **Implement the Business Logic (`/src/index.ts`):**
    -   Import the `productRepository`.
    -   After validating the input, call `productRepository.findOrCreateCategory()` with the `categoryName` from the incoming message to get a category entity.
    -   Then, call `productRepository.createProduct()` with the product data and the `categoryId` you just retrieved.
    -   The final result of this process is the newly created product record.

### Task 3: Integrate with EventBridge

Notify downstream systems that a new product has been created.

1.  **Publish the Domain Event (`/src/index.ts`):** After successfully creating the product, publish a `ProductCreated` event to the `company-events` EventBridge bus. The event payload should contain the data of the newly created product.
2.  **Create a Rule and Target (`/terraform/main.tf`):** Create a new EventBridge rule that filters for your `ProductCreated` events. Configure a target for this rule, choosing the type you think is most appropriate and implementing its basic definition in Terraform.
