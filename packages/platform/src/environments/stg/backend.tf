terraform {
  backend "s3" {
    bucket         = "terraform-state-bucket"
    key            = "stg/terraform-state-key"
    region         = "eu-west-1"
    dynamodb_table = "ro-terraform-state-lock"
    encrypt        = true
  }


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
