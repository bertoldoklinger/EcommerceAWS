import * as cdk from "aws-cdk-lib";
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambdaNodeJS from 'aws-cdk-lib/aws-lambda-nodejs';
import * as cwlogs from 'aws-cdk-lib/aws-logs';
import { Construct } from "constructs";

interface ECommerceApiStackProps extends cdk.StackProps {
  productsFetchHandler: lambdaNodeJS.NodejsFunction
}

export class ECommerceApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ECommerceApiStackProps) {
    super(scope, id, props);

    // cria um loggroup para o cloudwatch
    const logGroup = new cwlogs.LogGroup(this, "EcommerceApiLogs")

    // instancia o api gateway
    const api = new apigateway.RestApi(this, "EcommerceApi", {
      restApiName: "EcommerceApi",
      cloudWatchRole: true,
      // integra api gateway ao cloudwatch em formato json
      deployOptions: {
        accessLogDestination: new apigateway.LogGroupLogDestination(logGroup),
        accessLogFormat: apigateway.AccessLogFormat.jsonWithStandardFields({
          httpMethod: true,
          ip: true,
          protocol: true,
          requestTime: true,
          resourcePath: true,
          responseLength: true,
          caller: true,
          status: true,
          user: true,
        })
      }
    })

    // integra o api gateway com o lambda de productsFetch
    const productsFetchIntegration = new apigateway.LambdaIntegration(props.productsFetchHandler)

    // cria a rota "/products"
    const productsResource = api.root.addResource("products")

    // adiciona o método handler do lambda ao path /products GET do api gateway
    productsResource.addMethod("GET", productsFetchIntegration)
  }
}