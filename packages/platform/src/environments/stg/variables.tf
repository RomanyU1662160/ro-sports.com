variable "environment" {
  description = "The environment to deploy to"
  type        = string
}

variable "aws_profile" {
  description = "value of the AWS profile to use for deployment defined in ~/.aws/credentials"
  type        = string
}

variable "aws_region" {
  description = "The AWS region to deploy to"
  type        = string
}


variable "project_name" {
  description = "The name of the project"
  type        = string
  default     = "ro-sports-club-stg"
}


variable "SQS_queue_name" {
  description = "The name of the SQS queue"
  type        = string
}

variable "runtime" {
  description = "The runtime for the Lambda function"
  type        = string
}
