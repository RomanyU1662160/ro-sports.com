variable "environment" {
  description = "The environment to deploy to"
  type        = string


}

variable "bus_name" {
  description = "The name of the EventBridge bus"
  type        = string
  default     = "ro-sports-oms"
}

variable "rule_name" {
  description = "The name of the EventBridge rule"
  type        = string
}

variable "event_pattern" {
  description = "The event pattern to match"
  type        = string
}
variable "target_arn" {
  description = "ARN of the target resource (e.g., Lambda function)"
  type        = string
}

variable "target_id" {
  description = "The ID of the target resource"
  type        = string
}
