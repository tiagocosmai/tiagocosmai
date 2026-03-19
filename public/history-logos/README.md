# Logos do histórico profissional

O site tenta, por ordem: **`history-logos/{slug}.png`**, depois **`project-logos/{slug}.png`** (mesmo ficheiro serve nas duas secções), Clearbit e favicon Google.

Coloque aqui **ou** em `project-logos/` ficheiros **PNG** com estes nomes:

| Ficheiro        | Empresa        |
|-----------------|----------------|
| `futuresecure.png` | Future Secure AI |
| `teros.png`     | Teros          |
| `cvc.png`       | CVC Corp       |
| `termomecanica.png` | Termomecânica |
| `micropower.png`| MicroPower     |

Para tentar descarregar automaticamente (requer rede):

```bash
node scripts/fetch-history-logos.mjs
```

Também pode exportar o logo do LinkedIn ou do site da empresa e guardar com o nome acima.
