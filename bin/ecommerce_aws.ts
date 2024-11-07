#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { ECommerceApiStack } from '../lib/ecommerceApi-stack';
import { ProductsAppStack } from '../lib/productsApp-stack';

const app = new cdk.App();

const env: cdk.Environment = {
  account: '856966282327',
  region: 'sa-east-1'
}

const tags = {
  cost: "ECommerce",
  team: "BertoldoDev"
}

const productsAppStack = new ProductsAppStack(app, "ProductsApp", {
  tags,
  env,
})

// aqui injetamos a dependencia do productsFetchHandler no api gateway
const ecommerceApiStack = new ECommerceApiStack(app, "EcommerceApi", {
  productsFetchHandler: productsAppStack.productsFetchHandler,
  tags,
  env
})
// aqui adicionamos a dependencia
ecommerceApiStack.addDependency(productsAppStack)