module "order_events_queue" {
  source      = "../../modules/sqs"
  environment = var.environment
  name        = var.SQS_queue_name
}
