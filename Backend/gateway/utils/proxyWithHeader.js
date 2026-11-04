import proxy from "express-http-proxy";

export const proxyWithHeader=(serviceUrl)=>{
    return  proxy(serviceUrl,{

    proxyReqOptDecorator: (proxyReqOpts, req) => {
        // Add the sessionId cookie to the proxied request
        
        if (req.user) {
            proxyReqOpts.headers['x-user-id'] = req.user?._id;
        }
        if (process.env.INTERNAL_SERVICE_TOKEN) {
            proxyReqOpts.headers['x-internal-service-token'] = process.env.INTERNAL_SERVICE_TOKEN;
        }
        return proxyReqOpts;
    },
}
)
}
