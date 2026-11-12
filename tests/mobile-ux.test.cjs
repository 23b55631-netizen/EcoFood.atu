const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const upgrades=fs.readFileSync(path.join(__dirname,'..','dist','product-upgrades.js'),'utf8');
const css=fs.readFileSync(path.join(__dirname,'..','dist','platform.css'),'utf8');

test('operator QR screen is camera-first and hides QR catalogue',()=>{
  assert.match(upgrades,/role==='Operator'\)return `\$\{intro\(L\(\)\.mobile,U\(\)\.scanNow\)\}\$\{scanner\}`/);
  assert.match(upgrades,/state\.page==='mobile'.*!platform\.qrStream\)startScanner\(\)/);
  assert.match(upgrades,/qr-manual-fallback/);
});

test('mobile navigation uses QR artwork and role-aware submissions',()=>{
  assert.match(upgrades,/icons\.mobile=qrNavIcon/);
  assert.match(upgrades,/mySubmissions:'Менің өтінімдерім'/);
  assert.match(upgrades,/\['dashboard','forms','mobile','submissions','settings'\]/);
  assert.match(upgrades,/const scopedSubmissions=submissionsV2/);
  assert.match(upgrades,/operator-filter/);
  assert.match(upgrades,/mobile-submission-card/);
});

test('QR validation rejects foreign codes and locks operator organization',()=>{
  assert.match(upgrades,/url\.origin!==location\.origin\|\|url\.pathname!==location\.pathname/);
  assert.match(upgrades,/point\.org!==platform\.user\.org/);
  assert.match(upgrades,/fixed-field-value/);
  assert.match(upgrades,/pointSelected/);
});

test('QR camera can recover from denied access and avoids duplicate scans',()=>{
  assert.match(upgrades,/retryQrCamera/);
  assert.match(upgrades,/NotAllowedError/);
  assert.match(upgrades,/qrLastValue/);
  assert.match(upgrades,/navigator\.vibrate/);
  assert.match(upgrades,/visibilitychange/);
});

test('Telegram helper remains accessible without covering mobile navigation',()=>{
  assert.match(upgrades,/https:\/\/t\.me\/EcoFood_HelpBot/);
  assert.match(upgrades,/telegramHelp/);
  assert.match(css,/\.telegram-help/);
  assert.match(css,/bottom:calc\(76px \+ env\(safe-area-inset-bottom\)\)/);
});
