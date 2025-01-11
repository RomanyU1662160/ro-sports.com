variable "environment" {
  description = "The environment to deploy to"
  type        = string
}

variable "SQS_queue_name" {
  description = "The name of the SQS queue"
  type        = string
}
