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

variable "s3_bucket_name" {
  description = "The name of the S3 bucket to store the Terraform state file"
  type        = string
}

variable "dynamodb_table_name" {
  description = "The name of the DynamoDB table to store the Terraform state lock"
  type        = string
}
