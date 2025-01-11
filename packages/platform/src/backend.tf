terraform {
  backend "s3" {
    bucket         = "terraform-state-bucket"
    key            = "terraform-state-key"
    region         = "eu-west-1"
    dynamodb_table = "terraform-state-lock"
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
  profile = "603825719481_AdministratorAccess"
  region  = "eu-west-1"

  default_tags {
    tags = {
      "Terraform" = "true"
      Environment = terraform.workspace
      project     = "ro-sports-club"
      ManagedBy   = "Terraform"
    }
  }
}
