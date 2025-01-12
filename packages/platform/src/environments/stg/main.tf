module "order_events_queue" {
  source      = "../../modules/sqs"
  environment = var.environment
  name        = var.SQS_queue_name
}

module "order_events_lambda" {
  source        = "../../modules/lambda"
  environment   = var.environment
  function_name = "order-events-processor"
  filename      = "../dist/order-events-processor.zip"
  handler       = "app.handler"
  runtime       = var.runtime
  role_arn      = module.order_events_queue.role_arn
  environment_variables = {
    SQS_URL = module.order_events_queue.queue_url
  }
}

module "lambda_role" {
  source      = "../../modules/iam"
  role_name   = "order-events-lambda-role"
  environment = var.environment
}
