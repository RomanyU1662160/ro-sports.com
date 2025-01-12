terraform {
  backend "s3" {
    bucket         = "ro-terraform-state-bucket"
    key            = "dev/ro-terraform-state-key"
    region         = "eu-west-1"
    dynamodb_table = "ro-terraform-state-lock"
    encrypt        = true
  }

}


