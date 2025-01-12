variable "environment" {
  description = "The environment in which the resources are created"
  type        = string

}

variable "role_name" {
  description = "The name of the IAM role to create for the Lambda function"
  type        = string
}
