/**
 * Convite da Valentina · backend da confirmação de presença (Google Planilhas + Apps Script)
 *
 * Como usar (passo a passo completo no README):
 * 1. Crie uma planilha nova no Google Planilhas.
 * 2. Menu Extensões → Apps Script. Apague o conteúdo e cole este arquivo inteiro.
 * 3. Rode a função `configurar` uma vez (autorize quando o Google pedir).
 * 4. Implantar → Nova implantação → App da Web · Executar como: Eu · Quem pode acessar: Qualquer pessoa.
 * 5. Copie a URL que termina em /exec e cole em `urlPlanilha` no src/config.ts.
 */

var ABA_CONFIRMACOES = 'Confirmações';
var ABA_RESUMO = 'Resumo';
var CABECALHO = ['Data/hora', 'Nome', 'Vem?', 'Adultos', 'Crianças', 'Recadinho', 'ID'];
var COL_ID = 7;
var FUSO = 'America/Sao_Paulo';

/** Recebe a confirmação enviada pelo site (application/x-www-form-urlencoded). */
function doPost(e) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) {
    return responder({ ok: false, erro: 'Planilha ocupada, tente de novo.' });
  }
  try {
    var p = (e && e.parameter) || {};

    // Honeypot: se o campo invisível veio preenchido, é robô. Fingimos que deu certo.
    if (p.website) return responder({ ok: true });

    var nome = limpar(p.nome, 80);
    if (nome.length < 2) return responder({ ok: false, erro: 'Nome inválido.' });

    var vem = p.vem === 'sim';
    var adultos = vem ? numero(p.adultos, 1, 20, 1) : 0;
    var criancas = vem ? numero(p.criancas, 0, 20, 0) : 0;
    var recado = limpar(p.recado, 500);
    var id = limpar(p.id, 64).replace(/[^\w-]/g, '') || Utilities.getUuid();

    var aba = prepararPlanilha_().confirmacoes;
    var linha = [new Date(), seguro(nome), vem ? 'Sim' : 'Não', adultos, criancas, seguro(recado), id];

    // Upsert pelo ID: o mesmo aparelho atualiza a própria linha, nunca duplica.
    var indice = -1;
    var ultima = aba.getLastRow();
    if (ultima > 1) {
      var ids = aba.getRange(2, COL_ID, ultima - 1, 1).getValues();
      for (var i = 0; i < ids.length; i++) {
        if (String(ids[i][0]) === id) {
          indice = i + 2;
          break;
        }
      }
    }
    if (indice > 0) {
      aba.getRange(indice, 1, 1, linha.length).setValues([linha]);
    } else {
      aba.appendRow(linha);
    }

    return responder({ ok: true, atualizado: indice > 0 });
  } catch (erro) {
    return responder({ ok: false, erro: String(erro) });
  } finally {
    lock.releaseLock();
  }
}

/** Abrir a URL /exec no navegador mostra esta mensagem: serve para testar se está publicado. */
function doGet() {
  return ContentService.createTextOutput(
    '💦 Funcionando! A planilha de confirmações da pool party está pronta para receber respostas.'
  ).setMimeType(ContentService.MimeType.TEXT);
}

/** Rode UMA vez pelo editor (botão ▶ Executar) para criar as abas e autorizar o script. */
function configurar() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setSpreadsheetTimeZone(FUSO);
  prepararPlanilha_();
  SpreadsheetApp.flush();
  Logger.log('Tudo pronto! Agora publique: Implantar → Nova implantação → App da Web.');
}

/* ---------------- auxiliares ---------------- */

function prepararPlanilha_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var conf = ss.getSheetByName(ABA_CONFIRMACOES);
  if (!conf) {
    conf = ss.getSheets().length === 1 && ss.getSheets()[0].getLastRow() === 0
      ? ss.getSheets()[0].setName(ABA_CONFIRMACOES)
      : ss.insertSheet(ABA_CONFIRMACOES);
  }
  if (conf.getRange(1, 1).getValue() !== CABECALHO[0]) {
    conf.getRange(1, 1, 1, CABECALHO.length).setValues([CABECALHO]);
    conf.getRange(1, 1, 1, CABECALHO.length)
      .setBackground('#f2c4cb')
      .setFontColor('#24306a')
      .setFontWeight('bold');
    conf.setFrozenRows(1);
    conf.getRange('A:A').setNumberFormat('dd/MM/yyyy HH:mm:ss');
    conf.getRange('D:E').setNumberFormat('0');
    conf.getRange('G:G').setNumberFormat('@');
    conf.setColumnWidth(1, 150);
    conf.setColumnWidth(2, 220);
    conf.setColumnWidth(6, 320);
    conf.setColumnWidth(7, 120);
  }

  var resumo = ss.getSheetByName(ABA_RESUMO);
  if (!resumo) {
    resumo = ss.insertSheet(ABA_RESUMO);
    var c = "'" + ABA_CONFIRMACOES + "'!";
    resumo.getRange('A1:B1').setValues([['Resumo da pool party 💦', '']]);
    resumo.getRange('A1:B1').merge().setBackground('#b4cbea').setFontColor('#24306a').setFontWeight('bold');
    var linhas = [
      ['Respostas recebidas', '=COUNTA(' + c + 'B2:B)'],
      ['Famílias que vêm', '=COUNTIF(' + c + 'C2:C,"Sim")'],
      ['Famílias que não vêm', '=COUNTIF(' + c + 'C2:C,"Não")'],
      ['Adultos', '=SUMIF(' + c + 'C2:C,"Sim",' + c + 'D2:D)'],
      ['Crianças', '=SUMIF(' + c + 'C2:C,"Sim",' + c + 'E2:E)'],
      ['Total de convidados', '=B5+B6'],
    ];
    resumo.getRange(2, 1, linhas.length, 1).setValues(linhas.map(function (l) { return [l[0]]; }));
    resumo.getRange(2, 2, linhas.length, 1).setFormulas(linhas.map(function (l) { return [l[1]]; }));
    resumo.getRange('A2:A7').setFontWeight('bold').setFontColor('#24306a');
    resumo.getRange('A7:B7').setBackground('#fbecee').setFontWeight('bold');
    resumo.setColumnWidth(1, 200);
    resumo.setFrozenRows(1);
  }

  return { confirmacoes: conf, resumo: resumo };
}

function limpar(valor, max) {
  return String(valor == null ? '' : valor)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .trim()
    .slice(0, max);
}

function numero(valor, min, max, padrao) {
  var n = parseInt(valor, 10);
  if (isNaN(n)) return padrao;
  return Math.min(max, Math.max(min, n));
}

/** Neutraliza fórmulas: texto começando com = + - @ ganha um apóstrofo na frente. */
function seguro(texto) {
  return /^[=+\-@]/.test(texto) ? "'" + texto : texto;
}

function responder(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
