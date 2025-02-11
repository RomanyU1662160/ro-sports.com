terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  profile = var.aws_profile
  region  = var.aws_region
  default_tags {
    tags = {
      "Terraform" = "true"
      Environment = terraform.workspace
      project     = var.project_name
      ManagedBy   = "Terraform"
    }
  }
}
