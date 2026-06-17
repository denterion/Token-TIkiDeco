# TikiDeco Custom Domain

Target domain: `tikideco.xyz`

Status: repository and public copy prepared. DNS and GitHub Pages settings still need to be configured by the repository/domain owner.

## Repository Changes

- Public site canonical URL: `https://tikideco.xyz/`
- Open Graph URL and images use `https://tikideco.xyz/`
- `robots.txt` points to `https://tikideco.xyz/sitemap.xml`
- `sitemap.xml` points to `https://tikideco.xyz/`
- `site/CNAME` contains `tikideco.xyz`

Note: this project deploys GitHub Pages through a custom GitHub Actions workflow. GitHub's docs say custom workflow publishing does not require a `CNAME` file and may ignore it. The authoritative setting is still the GitHub Pages custom domain field.

## GitHub Pages Settings

In the GitHub repository:

1. Open `Settings`.
2. Open `Pages`.
3. In `Custom domain`, enter:

```text
tikideco.xyz
```

4. Save.
5. After DNS propagates, enable `Enforce HTTPS` when GitHub allows it.

GitHub recommends verifying the custom domain before or during this setup to reduce takeover risk.

## DNS Records

For the apex domain `tikideco.xyz`, create these `A` records:

| Type | Host | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |

Optional IPv6 records:

| Type | Host | Value |
| --- | --- | --- |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |

For `www.tikideco.xyz`, create:

| Type | Host | Value |
| --- | --- | --- |
| CNAME | `www` | `denterion.github.io` |

Do not create wildcard DNS records such as `*.tikideco.xyz`.

## Verification Commands

On Windows PowerShell:

```powershell
Resolve-DnsName tikideco.xyz -Type A
Resolve-DnsName tikideco.xyz -Type AAAA
Resolve-DnsName www.tikideco.xyz -Type CNAME
```

Expected apex `A` values are the four GitHub Pages IP addresses listed above.

## Public Communication Boundary

Changing the website domain does not change the project status:

- TIDE remains a Sepolia testnet prototype.
- TIDE is not offered for sale.
- TIDE has no stated monetary value.
- TIDE is not deployed on mainnet.
- Independent audit has not started.

## Sources

- GitHub Pages custom domain docs: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
- GitHub Pages custom domain troubleshooting: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/troubleshooting-custom-domains-and-github-pages
