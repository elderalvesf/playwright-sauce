# Briefing — Projeto 2: Framework E2E com Playwright + TypeScript + POM + Fixtures

> Cole este arquivo no início da sua sessão com o Claude Code.
> Ele contém todo o contexto necessário para construir o projeto sem explicar do zero.

---

## Quem sou eu

**Nome:** Elder Freitas
**Cargo atual:** QA Analyst (nível Sênior) na ArcTouch — agência global de produtos digitais
**Experiência:** 8+ anos em QA, passando por Sidia (Samsung R&D), Cornershop by Uber e ArcTouch
**Stack principal no trabalho:** WebDriverIO + JavaScript, Cypress, Playwright, Appium
**Objetivo deste projeto:** criar um repositório público no GitHub que demonstre domínio de Playwright com TypeScript, POM e Fixtures — padrão moderno adotado pelo próprio time do Playwright

---

## Contexto do projeto

Este é o **Projeto 2 de uma série de projetos públicos de QA**. Ele usa a mesma aplicação-alvo do Projeto 1 (SauceDemo) intencionalmente — o objetivo é demonstrar a diferença de abordagem, arquitetura e ecossistema entre WebDriverIO e Playwright, o que é um diferencial técnico claro para recrutadores e tech leads.

**O que diferencia este projeto do Projeto 1:**
- Framework: Playwright em vez de WebDriverIO
- Linguagem: TypeScript em vez de JavaScript
- Padrão: POM + Fixtures nativas do Playwright (em vez de POM puro com Mocha)
- Paralelismo: Playwright roda testes em paralelo nativamente — isso será demonstrado
- Multi-browser: Playwright testa em Chromium, Firefox e WebKit (Safari) — isso será configurado
- Trace Viewer: relatório visual nativo do Playwright, além do Allure

---

## Objetivo do repositório

Construir um **framework de testes E2E profissional e moderno** usando:

- **Playwright v1.40+** como framework de automação
- **TypeScript** como linguagem principal
- **Page Object Model (POM)** como padrão de arquitetura
- **Fixtures do Playwright** para setup/teardown e injeção de dependências
- **Playwright HTML Reporter + Allure** como ferramentas de relatório
- **GitHub Actions** como CI/CD com execução paralela e multi-browser
- **SauceDemo** (`https://www.saucedemo.com`) como aplicação-alvo

---

## Decisões de arquitetura (já definidas — não mudar sem justificativa)

### Por que TypeScript e não JavaScript?
TypeScript é o padrão do mercado para Playwright em 2025-2026. O próprio Playwright recomenda TypeScript em sua documentação oficial. Autocompletion, type safety e detecção de erros em tempo de compilação tornam o framework mais robusto e profissional. É também o que tech leads esperam ver em projetos sérios de automação.

### Por que Fixtures do Playwright e não beforeEach/afterEach simples?
Fixtures são o padrão recomendado pelo time do Playwright para:
- Injeção de dependências nos testes (Page Objects entram como parâmetros)
- Setup/teardown isolado por teste
- Composição de fixtures (uma fixture pode depender de outra)
- Fixtures com escopo configurável (test, worker, suite)
Usar `beforeEach` simples seria subutilizar o Playwright e não demonstraria conhecimento real da ferramenta.

### Por que rodar em múltiplos browsers?
Playwright suporta Chromium, Firefox e WebKit nativamente. Demonstrar isso em CI mostra que o framework está preparado para cross-browser testing real — algo que recrutadores europeus valorizam muito.

### Por que SauceDemo novamente?
Decisão intencional para mostrar a diferença de stack. Um recrutador que vê os dois projetos entende imediatamente: "esse QA sabe usar WebDriverIO E Playwright, e sabe as diferenças entre eles". É mais forte do que dois projetos em apps diferentes.

### Por que Playwright HTML Reporter + Allure?
- **Playwright HTML Reporter:** nativo, zero configuração, inclui screenshots, vídeos e traces — visual muito impressionante para recrutadores
- **Allure:** padrão reconhecido no mercado, consistência com o Projeto 1

---

## Estrutura de pastas esperada

```
qa-playwright-ts-pom/
│
├── .github/
│   └── workflows/
│       └── ci.yml                        # GitHub Actions — paralelo + multi-browser
│
├── src/
│   ├── fixtures/
│   │   └── index.ts                      # Fixtures customizadas (Page Objects injetados)
│   │
│   ├── pages/                            # Page Objects
│   │   ├── BasePage.ts                   # Classe base com métodos comuns
│   │   ├── LoginPage.ts                  # Page Object de login
│   │   ├── InventoryPage.ts              # Page Object de produtos
│   │   ├── CartPage.ts                   # Page Object do carrinho
│   │   └── CheckoutPage.ts              # Page Object do checkout
│   │
│   └── data/
│       └── testData.ts                   # Dados de teste tipados (interfaces + constantes)
│
├── tests/
│   ├── login.spec.ts                     # Testes de login
│   ├── inventory.spec.ts                 # Testes de listagem e filtro
│   ├── cart.spec.ts                      # Testes de carrinho
│   └── checkout.spec.ts                  # Testes de checkout E2E
│
├── playwright-report/                    # Gerado automaticamente (ignorado pelo git)
├── allure-results/                       # Gerado automaticamente (ignorado pelo git)
├── allure-report/                        # Gerado automaticamente (ignorado pelo git)
├── test-results/                         # Screenshots/vídeos de falhas (ignorado pelo git)
│
├── .gitignore
├── package.json
├── playwright.config.ts                  # Configuração central do Playwright
├── tsconfig.json                         # Configuração do TypeScript
└── README.md                             # Documentação profissional do projeto
```

---

## Cobertura de testes esperada

### Login (`login.spec.ts`)
- Login com credenciais válidas → deve redirecionar para inventory
- Login com senha inválida → deve exibir mensagem de erro
- Login com usuário bloqueado (`locked_out_user`) → deve exibir mensagem específica
- Login com campos vazios → deve exibir validação
- Logout → deve redirecionar para login

### Inventory (`inventory.spec.ts`)
- Listagem de produtos → deve exibir todos os 6 itens
- Filtro "Price (low to high)" → deve reordenar corretamente
- Filtro "Name (A to Z)" → deve reordenar corretamente
- Adicionar produto ao carrinho → badge do carrinho deve atualizar
- Remover produto do carrinho direto da listagem

### Cart (`cart.spec.ts`)
- Adicionar produto e verificar no carrinho
- Remover produto do carrinho
- Continuar comprando (voltar ao inventory)
- Verificar quantidade e nome do produto no carrinho

### Checkout (`checkout.spec.ts`)
- Checkout completo E2E (login → adicionar produto → checkout → finalizar)
- Checkout sem preencher nome → deve exibir erro
- Checkout sem preencher sobrenome → deve exibir erro
- Checkout sem CEP → deve exibir erro
- Verificar resumo do pedido (item, subtotal, tax, total)
- Confirmação de pedido finalizado

---

## Padrão de código esperado (importante para consistência)

### playwright.config.ts
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['allure-playwright'],
    ['list'],
  ],
  use: {
    baseURL: 'https://www.saucedemo.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  ],
});
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "outDir": "./dist",
    "rootDir": "./",
    "baseUrl": ".",
    "paths": {
      "@pages/*": ["src/pages/*"],
      "@fixtures/*": ["src/fixtures/*"],
      "@data/*": ["src/data/*"]
    }
  },
  "include": ["src/**/*", "tests/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Test Data tipado (modelo)
```typescript
export interface User {
  username: string;
  password: string;
}

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  zipCode: string;
}

export const USERS: Record<string, User> = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  locked:   { username: 'locked_out_user', password: 'secret_sauce' },
  problem:  { username: 'problem_user', password: 'secret_sauce' },
};

export const CHECKOUT_INFO: CheckoutInfo = {
  firstName: 'Elder',
  lastName:  'Freitas',
  zipCode:   '69000-000',
};

export const PRODUCTS = {
  backpack:  'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
} as const;
```

### Base Page (modelo)
```typescript
import { Page, Locator } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async navigate(path: string = ''): Promise<void> {
    await this.page.goto(path);
  }

  async click(selector: string): Promise<void> {
    await this.page.locator(selector).click();
  }

  async fill(selector: string, value: string): Promise<void> {
    await this.page.locator(selector).fill(value);
  }

  async getText(selector: string): Promise<string> {
    return this.page.locator(selector).innerText();
  }

  async isVisible(selector: string): Promise<boolean> {
    return this.page.locator(selector).isVisible();
  }

  async waitForUrl(urlPattern: string | RegExp): Promise<void> {
    await this.page.waitForURL(urlPattern);
  }
}
```

### Page Object (modelo)
```typescript
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private readonly usernameInput = '#user-name';
  private readonly passwordInput = '#password';
  private readonly loginButton   = '#login-button';
  private readonly errorMessage  = '[data-test="error"]';

  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.navigate('/');
  }

  async login(username: string, password: string): Promise<void> {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  async getErrorMessage(): Promise<string> {
    return this.getText(this.errorMessage);
  }

  async isErrorVisible(): Promise<boolean> {
    return this.isVisible(this.errorMessage);
  }
}
```

### Fixtures (padrão recomendado pelo Playwright)
```typescript
import { test as base } from '@playwright/test';
import { LoginPage }     from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage }      from '../pages/CartPage';
import { CheckoutPage }  from '../pages/CheckoutPage';

// Definição dos tipos das fixtures
type Pages = {
  loginPage:     LoginPage;
  inventoryPage: InventoryPage;
  cartPage:      CartPage;
  checkoutPage:  CheckoutPage;
};

// Exporta o `test` extendido com as fixtures
export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
});

export { expect } from '@playwright/test';
```

### Test / Spec (modelo)
```typescript
import { test, expect } from '../src/fixtures';
import { USERS }        from '../src/data/testData';

test.describe('Login', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('should login successfully with valid credentials', async ({ loginPage }) => {
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await expect(loginPage.page).toHaveURL(/inventory/);
  });

  test('should show error with invalid password', async ({ loginPage }) => {
    await loginPage.login(USERS.standard.username, 'wrong_password');
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Epic sadface');
  });

  test('should show specific error for locked out user', async ({ loginPage }) => {
    await loginPage.login(USERS.locked.username, USERS.locked.password);
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Sorry, this user has been locked out');
  });

  test('should show validation when fields are empty', async ({ loginPage }) => {
    await loginPage.login('', '');
    expect(await loginPage.isErrorVisible()).toBe(true);
  });
});
```

---

## package.json — scripts e dependências esperados

```json
{
  "name": "qa-playwright-ts-pom",
  "version": "1.0.0",
  "description": "Professional E2E test automation framework using Playwright, TypeScript, POM and Fixtures",
  "scripts": {
    "test":            "playwright test",
    "test:chromium":   "playwright test --project=chromium",
    "test:firefox":    "playwright test --project=firefox",
    "test:webkit":     "playwright test --project=webkit",
    "test:login":      "playwright test tests/login.spec.ts",
    "test:inventory":  "playwright test tests/inventory.spec.ts",
    "test:cart":       "playwright test tests/cart.spec.ts",
    "test:checkout":   "playwright test tests/checkout.spec.ts",
    "test:headed":     "playwright test --headed",
    "report:pw":       "playwright show-report playwright-report",
    "report:allure":   "allure generate allure-results --clean -o allure-report && allure open allure-report",
    "trace":           "playwright show-trace"
  },
  "devDependencies": {
    "@playwright/test":    "latest",
    "allure-playwright":   "latest",
    "allure-commandline":  "latest",
    "typescript":          "latest"
  }
}
```

---

## GitHub Actions (CI) — comportamento esperado

O workflow deve:
1. Rodar em cada `push` para `main` e em cada `pull_request`
2. Instalar Node.js 20 e dependências
3. Instalar browsers do Playwright (`npx playwright install --with-deps`)
4. Executar testes em paralelo nos 3 browsers (Chromium, Firefox, WebKit)
5. Gerar e publicar o relatório HTML do Playwright e o Allure como artifacts
6. Exibir badge de status no README

```yaml
name: E2E Tests — Playwright

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 30

    steps:
      - uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run Playwright tests
        run: npm test

      - name: Upload Playwright HTML Report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

      - name: Generate Allure Report
        if: always()
        run: npx allure generate allure-results --clean -o allure-report

      - name: Upload Allure Report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: allure-report
          path: allure-report/
          retention-days: 30
```

---

## README — o que precisa comunicar (em inglês)

1. **Título e badge de CI** (status do GitHub Actions)
2. **Descrição clara:** "Professional E2E test automation framework using Playwright v1.40+, TypeScript, Page Object Model, and Playwright Fixtures"
3. **Tech Stack** com badges visuais: Playwright, TypeScript, Allure, GitHub Actions
4. **Pré-requisitos:** Node.js 18+, npm
5. **Como rodar localmente:** clone → npm ci → npx playwright install → npm test
6. **Scripts disponíveis:** tabela completa com todos os scripts e o que fazem
7. **Browsers suportados:** Chromium, Firefox, WebKit (Safari)
8. **Cobertura de testes:** tabela com suítes e casos
9. **Como visualizar relatórios:** Playwright HTML Report e Allure
10. **Como usar o Trace Viewer** para debug de falhas
11. **Decisões de design:** por que Fixtures em vez de beforeEach, por que TypeScript, por que multi-browser
12. **LinkedIn do autor:** link para `linkedin.com/in/elderalvesf`

---

## O que NÃO fazer (armadilhas comuns no Playwright com TypeScript)

- **Não usar `page.waitForTimeout()`** — é `time.sleep()` disfarçado. Usar `waitForSelector`, `waitForURL`, `waitForLoadState`, ou assertions com auto-wait nativo do Playwright
- **Não importar `test` diretamente de `@playwright/test`** nos specs — importar sempre do arquivo de fixtures (`../src/fixtures`) para ter acesso aos Page Objects injetados
- **Não usar `any` no TypeScript** — defeats the purpose. Tipar tudo corretamente, especialmente os dados de teste
- **Não hardcodar credenciais** — centralizar em `src/data/testData.ts`
- **Não commitar `playwright-report/`, `allure-results/`, `allure-report/`, `test-results/`** — adicionar ao `.gitignore`
- **Não usar seletores frágeis** — preferir `data-test`, `role`, `label` em vez de XPath ou classes CSS dinâmicas. O SauceDemo tem `data-test` em quase tudo
- **Não criar Page Objects como singletons** (como no Projeto 1 com WebDriverIO) — no Playwright, Page Objects recebem `page` no construtor e são instanciados via fixtures. Cada teste tem sua própria instância isolada

---

## Diferenças-chave para defender em entrevista

Se um tech lead perguntar "qual a diferença entre seu projeto WebDriverIO e este Playwright?", a resposta:

| Aspecto | WebDriverIO (Projeto 1) | Playwright (Projeto 2) |
|---|---|---|
| Linguagem | JavaScript | TypeScript |
| Protocolo | WebDriver (W3C) | CDP + WebSocket próprio |
| Paralelismo | Configurado manualmente | Nativo, por arquivo |
| Multi-browser | Via capabilities | Nativo via `projects` |
| Waits | Explícitos com `waitFor*` | Auto-wait nativo em assertions |
| Fixtures | Mocha beforeEach | Playwright Fixtures (DI nativo) |
| Debug | Logs + screenshots | Trace Viewer (timeline visual) |
| Velocidade | Mais lento (protocolo HTTP) | Mais rápido (comunicação direta) |

---

## Instruções para o Claude Code

Ao iniciar a sessão no Claude Code, cole este arquivo e peça:

```
Leia o briefing acima e implemente o projeto completo seguindo exatamente:
1. Criar a estrutura de pastas conforme especificado
2. Criar playwright.config.ts com suporte a Chromium, Firefox e WebKit
3. Criar tsconfig.json com path aliases configurados
4. Implementar BasePage.ts com os métodos base
5. Implementar os 4 Page Objects (Login, Inventory, Cart, Checkout)
6. Implementar src/fixtures/index.ts com as fixtures injetando os Page Objects
7. Implementar as 4 suítes de teste usando as fixtures (NÃO importar test direto do @playwright/test)
8. Criar src/data/testData.ts com interfaces TypeScript e dados tipados
9. Criar package.json com todos os scripts descritos
10. Criar ci.yml para GitHub Actions com multi-browser e upload de relatórios
11. Criar .gitignore cobrindo node_modules, playwright-report, allure-results, allure-report, test-results
12. Criar README.md profissional conforme descrito
Após criar tudo, compilar o TypeScript e rodar os testes localmente confirmando que estão passando.
```

---

## Checklist final antes de publicar no GitHub

- [ ] Todos os testes passando localmente nos 3 browsers (`npm test`)
- [ ] TypeScript compilando sem erros (`npx tsc --noEmit`)
- [ ] CI verde no GitHub Actions após primeiro push
- [ ] README com badge de CI, tabela comparativa e instruções claras
- [ ] Nenhuma credencial hardcodada fora de `src/data/testData.ts`
- [ ] `.gitignore` cobrindo todos os diretórios gerados automaticamente
- [ ] Commits seguindo Conventional Commits (`feat:`, `test:`, `fix:`, `docs:`, `chore:`)
- [ ] Repositório com descrição configurada no GitHub
- [ ] Topics configurados: `playwright`, `typescript`, `selenium`, `page-object-model`, `fixtures`, `test-automation`, `qa`, `e2e-testing`, `allure`, `cross-browser`

---

## Próximos projetos da série (para referência futura)

- **Projeto 3:** Framework Mobile com Appium + Python
- **Projeto 4:** Framework E2E com Cypress + JavaScript + Accessibility Testing (cypress-axe)
- **Projeto Bônus:** Accessibility Testing Framework (WCAG + axe-core)
