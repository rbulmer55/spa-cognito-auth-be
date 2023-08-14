import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
	UserPool,
	UserPoolClient,
	UserPoolDomain,
} from 'aws-cdk-lib/aws-cognito';

export class BackendStack extends cdk.Stack {
	public readonly userPoolId: string;
	public readonly clientId: string;
	public readonly hostedDomain: string;

	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		/**
		 * Create our basic user pool
		 */
		const userPool = new UserPool(this, 'backend-user-pool', {
			userPoolName: 'backend-user-pool',
			removalPolicy: cdk.RemovalPolicy.DESTROY,
		});
		this.userPoolId = userPool.userPoolId;

		/**
		 * Create a hosted domain for activating and alternative login
		 * Optional.
		 */
		const hostedDomain = new UserPoolDomain(this, 'up-domain', {
			userPool,
			cognitoDomain: { domainPrefix: 'backend-up-0823' },
		});
		this.hostedDomain = hostedDomain.domainName;

		/**
		 * Create an App client to integrate with the userpool
		 */
		const appClient = new UserPoolClient(this, 'backend-client', {
			userPool,
			authFlows: { userSrp: true },
			oAuth: {
				flows: {
					implicitCodeGrant: false,
					authorizationCodeGrant: true,
				},
				//change this with UI deployments
				callbackUrls: ['http://localhost:5173/'],
			},
		});
		this.clientId = appClient.userPoolClientId;
	}
}
