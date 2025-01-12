variable "function_name" {
  description = "The name of the Lambda function"
  type        = string
}

variable "runtime" {
  description = "The runtime of the Lambda function"
  type        = string
  default     = "nodejs22.x"
}

variable "role_arn" {
  description = "The ARN of the IAM role to use for the Lambda function"
  type        = string
}

variable "handler" {
  description = "The entrypoint of the Lambda function handler function (e.g. index.handler)"
  type        = string

}

variable "filename" {
  description = "Path to the filename of the source code to upload to the Lambda function"
  type        = string
}

variable "environment_variables" {
  description = "A map of environment variables to set on the Lambda function"
  type        = map(string)
}

variable "environment" {
  description = "The environment to deploy the Lambda function to"
  type        = string
}

variable "timeout" {
  description = "The amount of time the Lambda function has to run in seconds"
  type        = number
  default     = 3
}

variable "memory_size" {
  description = "The amount of memory to allocate to the Lambda function in MB"
  type        = number
  default     = 128

}

variable "log_retention" {
  description = "The number of days to retain logs for the Lambda function"
  type        = number
  default     = 14

}
