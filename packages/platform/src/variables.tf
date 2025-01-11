variable "environment" {
  description = "The environment to deploy to"
  type        = string

}
variable "aws_region" {
  description = "The AWS region to deploy to"
  type        = string
}


variable "project_name" {
  description = "The name of the project"
  type        = string
  default     = "ro-sports-club"
}
