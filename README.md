# Simple-MSP

Serverless simple Minecraft services reversed proxy, powered by Cloudflare Workers.

> [!NOTE]
> Don't publish your deployment URL if possible, as there're many reasons:
>
> - Mojang's API has a rate limit.
> - Free-tier workers have only 100k handleable requests per day.

## Deploying

First, clone this repository using:

```shell
git clone https://github.com/XIAYM-gh/Simple-MSP --depth 1
```

Then, run the commands below in your terminal:

```shell
npm i
npx wrangler deploy
```

After deploying, you can set a custom url to avoid being blocked by some great network filters.  
Here we assume the url is `https://msp.example.com`.

## Usage

### Minecraft Client / Server

For versions greater than 1.16 (inclusive), add these properties to your JVM parameters:

> [!WARNING]
> Only HTTPS addresses are supported on servers, using HTTP will cause a decoding failure.

```
-Dminecraft.api.account.host=https://msp.example.com/account
-Dminecraft.api.session.host=https://msp.example.com/session
-Dminecraft.api.services.host=https://msp.example.com/services
```

As for 1.14 & 1.15, please install [Fallen-Breath's AuthlibEnvBackport](https://github.com/Fallen-Breath/AuthlibEnvBackport) first.

### Velocity Proxy

Simply add this to your JVM paramaters (there're two `session`s):

```
-Dmojang.sessionserver=https://msp.example.com/session/session/minecraft/hasJoined
```

## Acknowledgements

We referred to:

- [Minecraft Wiki: Mojang API](https://minecraft.wiki/w/Mojang_API), whose content is published under [CC3.0-BY-SA](https://creativecommons.org/licenses/by-sa/3.0/).
- [Fallen-Breath's Article](https://www.bilibili.com/opus/1042175188776517638) (Simplified Chinese), thanks a lot!

## License

This project is licensed under [MIT License](/LICENSE).
