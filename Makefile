.PHONY: up apply test publish-event check-queue invoke-lambda

up:
	docker-compose up -d

apply:
	npm run build
	cd terraform && terraform init && terraform apply -auto-approve

test:
	npm test

publish-event:
	@echo "Publishing a sample event to the 'company-events' bus..."
	@AWS_ACCESS_KEY_ID=test AWS_SECRET_ACCESS_KEY=test AWS_DEFAULT_REGION=us-east-1 aws --region us-east-1 --endpoint-url=http://localhost:4566 events put-events --entries '[{"Source":"manual-test","DetailType":"TestEvent","Detail":"{\"productName\":\"Test from CLI\",\"price\":123,\"categoryName\":\"CLICategory\"}","EventBusName":"company-events"}]'

check-queue:
	@echo "Checking for messages on 'product-ingestion-queue'..."
	@AWS_ACCESS_KEY_ID=test AWS_SECRET_ACCESS_KEY=test AWS_DEFAULT_REGION=us-east-1 aws --region us-east-1 --endpoint-url=http://localhost:4566 sqs receive-message --queue-url http://localhost:4566/000000000000/product-ingestion-queue --max-number-of-messages 10

invoke-lambda:
	@echo "Manually invoking the ProductIngestionLambda..."
	@AWS_ACCESS_KEY_ID=test AWS_SECRET_ACCESS_KEY=test AWS_DEFAULT_REGION=us-east-1 aws --region us-east-1 --endpoint-url=http://localhost:4566 lambda invoke \
		--function-name ProductIngestionLambda \
		--payload file://lambda-payload-simple.json \
		response.json && echo "Lambda invoked. See response in response.json"


