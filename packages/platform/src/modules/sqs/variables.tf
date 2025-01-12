variable "environment" {
  description = "The environment to deploy to"
  type        = string
}

variable "name" {
  description = "The name of the SQS queue"
  type        = string
}

variable "visibility_timeout" {
  description = "The visibility timeout for the SQS queue"
  type        = number
  default     = 30
}

variable "retention_period" {
  description = "The retention period for the SQS queue"
  type        = number
  default     = 345600 # 4 days
}

variable "delay_seconds" {
  description = "The delay seconds for delivering messages to the SQS queue"
  type        = number
  default     = 0
}

variable "max_receive_count" {
  description = "The maximum number of times a message can be received before being sent to the dead letter queue"
  type        = number
  default     = 3
}
