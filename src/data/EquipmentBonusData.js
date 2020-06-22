"use strict";Object.defineProperty(exports,"t",{value:!0});class e{constructor(){this.s=0,this.o=0,this.u=0,this.i=0,this.l=0,this.g=0,this.S=0,this.F=0,this.P=0,this.h=0}add(t){return e.keys.forEach(e=>{this[e]+=t[e]}),this}multiply(t){return e.keys.forEach(e=>{this[e]*=t}),this}p(){return e.keys.some(e=>0!==this[e])}}e.keys=Object.keys(new e);const t=(e,t,n)=>{var c;const s=(null!==(c=e[t])&&void 0!==c?c:0)+n;e[t]=s};class n{constructor(e,n){this.v=10;const c={},s={},r={};for(const e of n){if(!e)continue;const{_:n,m:o}=e,u=c[n];Array.isArray(u)?u.push(e):c[n]=[e],t(s,n,1),t(r,o,1)}this.k=n.concat(),this.T=c,this.A=s,this.I=r,this.L=e.shipId,this.q=e.ruby,this.D=e.shipTypeId,this.O=e.shipClassId}j(e){var t;return null!==(t=this.A[e])&&void 0!==t?t:0}M(e){var t;return null!==(t=this.I[e])&&void 0!==t?t:0}R(e){const n=this.T[e],c=Array(11).fill(0);if(!n)return c;for(const e of n)t(c,e.level,1);return c}}class c extends Object{static B(t,s){let r;const o=new n(t,s),u=[];u.push({C:o.M(9),N:c.X},{C:o.M(29),N:c.G},{C:o.M(42),N:c.H},{C:o.M(12)||o.M(13),N:c.J},{C:o.j(15),N:c.K},{C:o.j(18)||o.j(52),N:c.U},{C:o.j(19),N:c.V},{C:o.j(24)||o.j(57)||o.j(111),N:c.W},{C:o.j(35),N:c.Y},{C:o.j(47),N:c.Z},{C:o.j(50),N:c.$},{C:o.j(58),N:c.ee},{C:o.j(61),N:c.te},{C:o.j(61),N:c.ne},{C:o.j(63),N:c.ce},{C:o.j(67),N:c.se},{C:o.j(79)||o.j(81),N:c.re},{C:o.j(82),N:c.oe},{C:o.j(87),N:c.ue},{C:o.j(90),N:c.ie},{C:o.j(93),N:c.le},{C:o.j(94),N:c.fe},{C:o.j(99),N:c.ae},{C:o.j(100),N:c.xe},{C:o.j(104),N:c.Ee},{C:o.j(106),N:c.we},{C:o.j(119),N:c.ge},{C:o.j(129),N:c.Se},{C:o.j(143),N:c.Fe},{C:o.j(144),N:c.Pe},{C:o.j(149),N:c.he},{C:o.j(171),N:c.pe},{C:o.j(174),N:c.ve},{C:o.j(179),N:c.de},{C:o.j(184),N:c._e},{C:o.j(188),N:c.ye},{C:o.j(189),N:c.me},{C:o.j(194),N:c.ke},{C:o.j(204),N:c.Te},{C:o.j(228),N:c.Ae},{C:o.j(229),N:c.Ie},{C:o.j(237),N:c.Le},{C:o.j(266),N:c.be},{C:o.j(266),N:c.qe},{C:o.j(267)||o.j(366),N:c.De},{C:o.j(267)||o.j(366),N:c.Oe},{C:o.j(268),N:c.je},{C:o.j(278),N:c.Me},{C:o.j(279),N:c.Re},{C:o.j(282),N:c.Be},{C:o.j(283),N:c.Ce},{C:o.j(285),N:c.Ne},{C:o.j(286),N:c.Xe},{C:o.j(287),N:c.ze},{C:o.j(288),N:c.Ge},{C:o.j(289),N:c.He},{C:o.j(290),N:c.Je},{C:o.j(291),N:c.Ke},{C:o.j(292),N:c.Qe},{C:o.j(293),N:c.Ue},{C:o.j(294),N:c.Ve},{C:o.j(295),N:c.We},{C:o.j(296),N:c.Ye},{C:o.j(297),N:c.Ze},{C:o.j(298)||o.j(299)||o.j(300),N:c.$e},{C:o.j(301),N:c.et},{C:o.j(302),N:c.tt},{C:o.j(303),N:c.nt},{C:o.j(304),N:c.ct},{C:o.j(305)||o.j(306),N:c.st},{C:o.j(307),N:c.rt},{C:o.j(308),N:c.ot},{C:o.j(310),N:c.ut},{C:o.j(313),N:c.it},{C:o.j(314),N:c.lt},{C:o.j(315),N:c.ft},{C:o.j(316),N:c.at},{C:o.j(317),N:c.xt},{C:o.j(318),N:c.Et},{C:o.j(319),N:c.wt},{C:o.j(320),N:c.gt},{C:o.j(322),N:c.St},{C:o.j(323),N:c.Ft},{C:o.j(324)||o.j(325),N:c.Pt},{C:o.j(326),N:c.ht},{C:o.j(327),N:c.pt},{C:o.j(328),N:c.vt},{C:o.j(329),N:c.dt},{C:o.j(330)||o.j(331)||o.j(332),N:c._t},{C:o.j(335),N:c.yt},{C:o.j(336),N:c.kt},{C:o.j(337),N:c.Tt},{C:o.j(338),N:c.At},{C:o.j(339),N:c.It},{C:o.j(340),N:c.Lt},{C:o.j(341),N:c.bt},{C:o.j(342),N:c.qt},{C:o.j(343),N:c.Dt},{C:o.j(344),N:c.Ot},{C:o.j(345),N:c.jt},{C:o.j(356)||o.j(357),N:c.Mt},{C:o.j(358),N:c.Rt},{C:o.j(359),N:c.Bt},{C:o.j(360)||o.j(361),N:c.Ct},{C:o.j(362)||o.j(363),N:c.Nt},{C:o.j(364),N:c.Xt},{C:o.j(365),N:c.zt},{C:o.j(367),N:c.Gt},{C:o.j(368),N:c.Ht},{C:o.j(369),N:c.Jt},{C:o.j(370),N:c.Kt},{C:o.j(371),N:c.Qt},{C:o.j(372),N:c.Ut},{C:o.j(373),N:c.Vt},{C:o.j(374),N:c.Wt},{C:o.j(375),N:c.Yt},{C:o.j(376),N:c.Zt},{C:o.j(377),N:c.$t},{C:o.j(378),N:c.en},{C:o.j(379),N:c.tn},{C:o.j(380),N:c.nn},{C:o.j(381),N:c.cn},{C:o.j(382),N:c.sn});const i=new e;for(const e of u){const t=e;t.C&&(r=t.N.call(null,o),i.add(r))}return i}static je(t){const n=new e;return"きそ"!=t.q&&"たま"!=t.q||(n.l=7,n.i=2),n}static G(t){const n=new e,c=t.M(29);return"ひえい"==t.q||"きりしま"==t.q||"ちょうかい"==t.q||"じんつう"==t.q||"あかつき"==t.q?(n.s+=4,--n.l):"あきぐも"==t.q?n.s+=2*c:"ゆきかぜ"==t.q&&(n.s+=c,n.u+=c),"じんつう"==t.q&&(n.o+=6,n.s+=4),n}static H(t){const n=new e;"ひえい"==t.q||"きりしま"==t.q?(n.s+=6,n.l-=2):"やまと"!=t.q&&"むさし"!=t.q||(n.s+=4,--n.l);const c=t.j(174);return 592==t.L&&(n.s+=3,n.o+=3,c>0&&(n.o+=5)),n}static J(t){let n=0;const c=new e;let s=0;if(569!=t.L)return c;s=1;let r=0;for(const e of t.k){const t=e;n=t.m,12!=n&&13!=n||(t.rn,t.on>=2&&++r)}return r>0&&1==s&&(++c.s,c.l+=3,c.u+=2),c}static De(t){const n=new e;let c=0,s=0;if(38==t.O||22==t.O)c=2,s=1;else{if(30!=t.O)return n;c=1,s=1}const r=t.j(267)+t.j(366);return n.s=c*r,n.l=s*r,n}static Oe(t){let n=0;const c=new e,s=t.j(267),r=t.j(366),o=s+r;if(566!=t.L&&567!=t.L&&568!=t.L||(s>0&&++c.s,1==r?(++c.s,c.u+=2):r>=2&&(c.s+=2,c.u+=4)),38!=t.O&&229!=t.L)return c;let u=!1,i=!1,l=!1,f=!1,a=!1,x=!1,E=!1;543==t.L?(c.s=1*o,u=!0):229==t.L?i=!0:542==t.L?(c.s=1*o,l=!0):563==t.L?(c.s=1*o,f=!0):564==t.L?(c.s=1*o,a=!0):578==t.L?(c.s=1*o,x=!0):569==t.L&&(c.s=1*o,E=!0);let w=0,g=0;for(const e of t.k){const t=e;n=t.m,12!=n&&13!=n||(t.rn>=5&&++w,t.on>=2&&++g)}return w>0&&s>0&&(38==t.O&&(c.s+=2,++c.o,0==u&&0==l&&0==f&&0==a&&0==x&&0==E&&(c.o+=2),++c.l),(l||u||i||f||a||x||E)&&(++c.s,c.o+=3,c.l+=2)),r>0&&(l||u||f||a||x||i||E)&&(1==r?c.u+=3:r>=2&&(c.u+=5),E&&(++c.s,c.u+=2),w>0&&(c.s+=2,c.l+=2,c.o+=4),g>0&&(++c.s,c.l+=2,c.u+=5)),c}static K(t){const n=new e;let c=!1;if(566!=t.L&&567!=t.L&&568!=t.L||(c=!0),0==c)return n;const s=t.j(15);return 30==t.O&&(1==s?n.o=2:s>=2&&(n.o=4)),n}static Ne(t){const n=new e;let c=!1;if([195,426,420,407,437,326,419,147,627].indexOf(t.L)>=0&&(c=!0),0==c)return n;const s=t.R(285);let r=t.j(285);r>2&&(r=2),n.o=2*r,n.l=1*r;const o=s[10];return 1==o?++n.s:o>=2&&(n.s+=2),n}static Xe(t){let n=0;const c=new e;let s=!1;if([566,145,498,144,469,463,468,199,489,490,464,470,198,543,567,568,497,542,563,564,587,578,569].indexOf(t.L)>=0&&(s=!0),0==s)return c;const r=t.R(286);let o=t.j(286);o>2&&(o=2);c.o=2*o,c.l=1*o;const u=r[10];return 1==u?++c.s:u>=2&&(c.s+=2),30==t.O&&(n=r[5]+r[6]+r[7]+r[8]+r[9]+r[10],1==n?++c.o:n>=2&&(c.o+=2)),c}static be(t){const n=new e;let c=!1;if(566!=t.L&&567!=t.L&&568!=t.L||(c=!0),0==c)return n;const s=t.j(266);return 30==t.O&&(1==s?n.s=1:s>=2&&(n.s=3)),n}static qe(t){let n=0,c=new e,s=0;const r=new e;if(23==t.O||18==t.O?(r.s=1,s=1):30==t.O&&(r.s=1,s=2),("しぐれ"==t.q||"ゆきかぜ"==t.q||"いそかぜ"==t.q)&&(r.l=1),!r.p())return c;const o=t.j(266);if(c=r.multiply(o),0==s)return c;let u=0;for(const e of t.k){const t=e;n=t.m,(12==n||13==n)&&t.rn>=5&&++u}return u>0&&(1==s?(++c.s,++c.l,c.o+=3):2==s&&(c.s+=2,++c.l,c.o+=3)),c}static Ee(t){let n=new e;const c=new e;if(149==t.L)c.s=2;else if(150==t.L)c.s=1;else if(152==t.L)c.s=1;else{if(151!=t.L)return n;c.s=2,c.u=1,c.l=2}const s=t.j(104);return n=c.multiply(s),n}static He(t){let n=0,c=new e,s=0;const r=new e;if(149==t.L)r.s=2,r.u=1,s=1;else if(150==t.L)r.s=1;else if(152==t.L)r.s=1;else{if(151!=t.L)return c;r.s=2,r.u=2,r.l=2,s=1}const o=t.j(289);if(c=r.multiply(o),0==s)return c;let u=0;for(const e of t.k){const t=e;n=t.m,(12==n||13==n)&&t.rn>=5&&++u}return u>0&&(c.s+=2,c.l+=2),c}static Je(t){let n=0,c=new e,s=0;const r=new e;if(411==t.L)r.s=1;else if(412==t.L)r.s=1;else if(82==t.L)r.s=2,r.u=2,r.l=1,s=1;else if(553==t.L)r.s=3,r.u=2,r.l=1,r.P=3,s=1;else if(88==t.L)r.s=2,r.u=2,r.l=1,s=1;else{if(554!=t.L)return c;r.s=3,r.u=2,r.l=2,r.P=3,s=1}const o=t.j(290);if(c=r.multiply(o),0==s)return c;let u=0;for(const e of t.k){const t=e;n=t.m,(12==n||13==n)&&t.on>=2&&++u}return u>0&&(c.u+=2,c.l+=3),c}static Qe(t){let n=new e;const c=new e;if(553==t.L)c.s=8,c.l=2,c.u=1;else{if(554!=t.L)return n;c.s=8,c.l=2,c.u=1}const s=t.j(292);return n=c.multiply(s),n}static Ke(t){let n=new e;const c=new e;if(553==t.L)c.s=6,c.l=1;else{if(554!=t.L)return n;c.s=6,c.l=1}const s=t.j(291);return n=c.multiply(s),n}static Le(t){let n=new e;const c=new e;if(553==t.L)c.s=4,c.l=2;else if(82==t.L)c.s=3,c.l=1;else if(88==t.L)c.s=3,c.l=1;else if(554==t.L)c.s=4,c.l=2;else if(411==t.L)c.s=2;else{if(412!=t.L)return n;c.s=2}const s=t.j(237);return n=c.multiply(s),n}static re(t){let n=new e;const c=new e;if(553==t.L)c.s=3;else if(82==t.L)c.s=2;else if(88==t.L)c.s=2;else if(554==t.L)c.s=3;else if(411==t.L)c.s=2;else{if(412!=t.L)return n;c.s=2}const s=t.j(79)+t.j(81);return n=c.multiply(s),n}static Ie(t){var n;let c=0,s=0;const r=new e;let o=0;for(const e of null!==(n=t.T[229])&&void 0!==n?n:[]){e.level>=7&&o++}const u=o;let i=0,l=0,f=0;if(622==t.L||623==t.L||624==t.L)c=t.j(229),r.s+=1*c,r.u+=1*c,i=2;else if(0==o)return r;if(488==t.L?(r.u+=3*u,i=1):220==t.L?r.u+=2*u:23==t.L?r.u+=1*u:160==t.L?(r.u+=2*u,i=1):224==t.L?r.u+=1*u:487==t.L?(r.u+=2*u,i=1):289==t.L&&(r.u+=1*u),(66==t.O||28==t.O)&&(r.s+=1*u,r.u+=1*u,l=1),1==t.D&&(r.s+=1*u,r.u+=1*u,f=1),("ゆら"==t.q||"なか"==t.q||"きぬ"==t.q)&&(r.s+=2*u),0==i+l+f)return r;let a=0,x=0;for(const e of t.k){const t=e;s=t.m,12!=s&&13!=s||(t.rn>=5&&++a,t.on>=2&&++x)}return 1==i?a>0&&(r.s+=3,r.l+=2):2==i&&(a>0&&(++r.s,++r.l),x>0&&(r.u+=2,r.l+=2)),1==l&&a>0&&(r.s+=2,r.l+=3),1==f&&a>0&&(++r.s,r.l+=4),r}static se(t){let n=new e;const c=new e;if(13!=t.D&&14!=t.D&&(c.o=-5),!c.p())return n;const s=t.j(67);return n=c.multiply(s),n}static ee(t){let n=new e;const c=new e;if("しまかぜ"!=t.q&&4!=t.D&&54!=t.O||(c.o=1),!c.p())return n;const s=t.j(58);return n=c.multiply(s),n}static de(t){let n=new e;const c=new e;if(54==t.O&&(c.o=1),!c.p())return n;const s=t.j(179);return n=c.multiply(s),n}static ve(t){let n=new e;const c=new e;if(66==t.O&&(c.o=1,c.l=2),591==t.L||592==t.L?(c.o+=6,c.l+=3):488!=t.L&&622!=t.L&&623!=t.L&&624!=t.L||(c.s+=2,c.o+=4,c.l+=4),!c.p())return n;const s=t.j(174);return n=c.multiply(s),n}static st(t){let n=new e;const c=new e;if(76==t.O&&(c.g=1,c.l=1),"しんよう"==t.q?(c.g+=2,++c.l):"グラーフ・ツェッペリン"!=t.q&&"アクィラ"!=t.q||(c.s=1,c.l=1),!c.p())return n;const s=t.j(305)+t.j(306);return n=c.multiply(s),n}static oe(t){let n=new e;const c=new e;if(76==t.O&&(c.g=1,c.l=1),!c.p())return n;const s=t.j(82);return n=c.multiply(s),n}static tt(t){let n=new e;const c=new e;if(76==t.O&&(c.g=1,c.l=1),!c.p())return n;const s=t.j(302);return n=c.multiply(s),n}static nt(t){let n=new e;const c=new e;if(16==t.O||4==t.O||20==t.O||41==t.O?(c.s=1,c.u=1):89==t.O&&(c.s=1,c.u=2,c.l=1),!c.p())return n;const s=t.j(303);return n=c.multiply(s),n}static rt(t){let n=new e;const c=new e;if(65!=t.O&&69!=t.O&&83!=t.O&&87!=t.O&&84!=t.O&&91!=t.O&&93!=t.O&&95!=t.O&&99!=t.O||(c.s=1,c.u=1,c.l=1),!c.p())return n;const s=t.j(307);return n=c.multiply(s),n}static ot(t){let n=new e;const c=new e;if(65!=t.O&&69!=t.O&&83!=t.O&&87!=t.O&&84!=t.O&&91!=t.O&&93!=t.O&&95!=t.O&&99!=t.O||(c.s=1,c.u=1,c.l=1),2==t.D?++c.s:1==t.D&&(++c.u,++c.l),!c.p())return n;const s=t.j(308);return n=c.multiply(s),n}static ct(t){let n=new e;const c=new e;if(16==t.O||4==t.O||20==t.O||41==t.O?(c.s=1,c.g=1,c.l=1):89==t.O&&(c.s=1,c.g=2,c.l=2),!c.p())return n;const s=t.j(304);return n=c.multiply(s),n}static ae(t){const n=new e;return"そうりゅう"==t.q?n.s=4:"ひりゅう"==t.q&&(n.s=1),n}static xe(t){let n=new e;const c=new e;if(553==t.L)c.s=4;else{if(554!=t.L)return 196==t.L?(n.s=3,n):197==t.L?(n.s=6,n):n;c.s=4}const s=t.j(100);return n=c.multiply(s),n}static W(t){let n=new e;const c=new e;if(553==t.L)c.s=2;else{if(554!=t.L)return n;c.s=2}const s=t.j(24)+t.j(57)+t.j(111);return n=c.multiply(s),n}static te(t){const n=new e;if(553==t.L)n.s=3,n.l=2,n.i=1,n.P=5,n.h=1;else if(554==t.L)n.s=3,n.l=3,n.i=3,n.P=5,n.h=1;else if(196==t.L)n.P=5,n.h=1;else{if(197!=t.L)return n;n.P=5,n.h=1}return n}static le(t){const n=new e;return"そうりゅう"==t.q?n.s=1:"ひりゅう"==t.q&&(n.s=3),n}static fe(t){const n=new e;if(196==t.L)n.s=7;else{if(197!=t.L)return n;n.s=3}return n}static Fe(t){const n=new e;return"あかぎ"==t.q?n.s=3:"かが"==t.q||"しょうかく"==t.q?n.s=2:("ずいかく"==t.q||"りゅうじょう"==t.q)&&(n.s=1),n}static Pe(t){const n=new e;return"あかぎ"==t.q?n.s=3:"かが"==t.q?n.s=2:"しょうかく"==t.q?(n.s=2,461!=t.L&&466!=t.L||(n.s+=2)):"ずいかく"==t.q?(n.s=1,462!=t.L&&467!=t.L||++n.s):"りゅうじょう"==t.q&&(n.s=1),n}static gt(t){let n=new e;const c=new e;if(553==t.L)c.s=2;else if(554==t.L)c.s=4;else if(196==t.L)c.s=3;else if(197==t.L)c.s=3;else if(508==t.L)c.s=4;else{if(509!=t.L)return n;c.s=4}const s=t.j(320);return n=c.multiply(s),n}static Ue(t){let n=0,c=new e;const s=new e;let r=0;if(66==t.O||28==t.O)s.s=2,s.u=1,s.l=3,r=1;else{if(74!=t.O&&77!=t.O)return c;s.s=1,s.u=1,s.l=2,r=2}const o=t.j(293);c=s.multiply(o);let u=0;for(const e of t.k){const t=e;n=t.m,(12==n||13==n)&&t.rn>=5&&++u}const i=t.j(174);return 1==r?(u>0&&(c.s+=2,c.l+=3,++c.o),1==i?(c.s+=2,c.o+=4):i>=2&&(c.s+=3,c.o+=7)):2==r&&u>0&&(c.s+=2,c.l+=3,++c.g),c}static Ve(t){let n=0,c=new e;const s=new e;if(12!=t.O&&1!=t.O&&5!=t.O)return c;s.s=1;const r=t.j(294);c=s.multiply(r);let o=0;for(const e of t.k){const t=e;n=t.m,(12==n||13==n)&&t.rn>=5&&++o}const u=t.j(13),i=t.j(125),l=t.j(285),f=u+i+l;return o>0&&(c.s+=3,c.l+=2,++c.o),1==f?(++c.s,c.o+=3):f>=2&&(c.s+=2,c.o+=5),l>=1&&++c.o,c}static We(t){let n=0,c=new e;const s=new e;if(12!=t.O&&1!=t.O&&5!=t.O)return c;s.s=2,s.u=2;const r=t.j(295);c=s.multiply(r);let o=0,u=0;for(const e of t.k){const t=e;n=t.m,12!=n&&13!=n||(t.rn>=5&&++o,t.on>=2&&++u)}const i=t.j(13),l=t.j(125),f=t.j(285),a=i+l+f;return o>0&&(c.s+=3,c.l+=2,++c.o),1==a?(++c.s,c.o+=3):a>=2&&(c.s+=2,c.o+=5),f>=1&&++c.o,u>0&&(c.u+=6),c}static Ze(t){let n=new e;const c=new e;if(12==t.O)c.l=2;else{if(1!=t.O&&5!=t.O)return n;c.l=1}const s=t.j(297);return n=c.multiply(s),n}static ce(t){let n=new e;const c=new e;1!=t.O&&5!=t.O&&10!=t.O||++c.u,"ゆうだち"==t.q&&(++c.s,++c.u,c.l+=2),145==t.L?++c.s:144==t.L?++c.o:469==t.L?c.l+=2:242==t.L||497==t.L||244==t.L||498==t.L?++c.l:627==t.L&&++c.s;let s=!0;if(c.p()||(s=!1),0==s)return n;const r=t.j(63);return n=c.multiply(r),n}static Ye(t){let n=0,c=new e;const s=new e;1!=t.O&&5!=t.O&&10!=t.O&&23!=t.O||++s.s,10!=t.O&&23!=t.O||++s.l,145==t.L?(++s.s,++s.u):144==t.L?(++s.s,++s.o):469==t.L||587==t.L||242==t.L?++s.l:497==t.L?(++s.s,++s.l):244==t.L?++s.l:498==t.L?(++s.u,++s.l):627==t.L&&(s.s+=2,++s.o);let r=!0;if(s.p()||(r=!1),0==r)return c;const o=t.j(296);c=s.multiply(o);let u=0;if(1!=t.O&&5!=t.O&&10!=t.O||(u=1),23==t.O&&(u=2),0==u)return c;let i=0,l=0;for(const e of t.k){const t=e;n=t.m,12!=n&&13!=n||(t.rn>=5&&++i,t.on>=2&&++l)}return i>0&&(1==u?(++c.s,c.l+=2,c.o+=2):2==u&&(++c.s,c.l+=2,c.o+=3)),t.j(285)+t.j(125)>=1&&1==u&&(++c.s,c.o+=3),t.j(15)+t.j(286)>=1&&2==u&&(++c.s,c.o+=3),l>0&&(1==u?c.u+=5:2==u&&(c.u+=6)),c}static ie(t){let n=0,c=0,s=new e;const r=new e;142==t.L?(r.s+=2,++r.l):295==t.L||416==t.L||417==t.L?++r.s:264==t.L&&(++r.s,++r.u),7!=t.O&&13!=t.O&&8!=t.O&&29!=t.O&&9!=t.O&&31!=t.O||++r.s,r.p()&&(n=t.j(90),s=r.multiply(n));const o=[];if("あおば"==t.q&&(o[1]=1),13!=t.O&&7!=t.O||(o[2]=1),0==o.length)return s;let u=0,i=0;for(const e of t.k){const t=e;c=t.m,12!=c&&13!=c||(t.rn>=5&&++u,t.on>=2&&++i)}return i>0&&null!=o[1]&&(s.u+=5,s.l+=2),u>0&&null!=o[2]&&(s.s+=3,s.l+=2,s.o+=2),s}static $(t){let n=0,c=0,s=new e,r=!1;const o=new e;7!=t.O&&13!=t.O&&8!=t.O&&29!=t.O&&9!=t.O&&31!=t.O||(++o.s,r=!0),8!=t.O&&29!=t.O&&9!=t.O&&31!=t.O||(++o.s,++o.l,r=!0);const u=t.j(50);if(9!=t.O&&31!=t.O||u>=2&&(++o.s,r=!0),0==r)return s;s=o.multiply(u);let i=0;for(const e of t.k){const t=e;n=t.m,(12==n||13==n)&&t.rn>=5&&++i}return i>0&&(7==t.O||13==t.O?(c=t.j(90),0==c&&(++s.s,++s.l,++s.o)):8!=t.O&&29!=t.O&&9!=t.O&&31!=t.O||(s.s+=3,s.l+=2,s.o+=2)),s}static $e(t){let n=new e;const c=new e;67==t.O||78==t.O||82==t.O||88==t.O?(c.s+=2,++c.i,67==t.O&&(c.l-=2)):149!=t.L&&150!=t.L&&151!=t.L&&152!=t.L||(++c.s,++c.i,c.l-=3);let s=!0;if(c.p()||(s=!1),0==s)return n;const r=t.j(298)+t.j(299)+t.j(300);return n=c.multiply(r),n}static et(t){let n=new e;const c=new e;67!=t.O&&78!=t.O&&82!=t.O&&88!=t.O||(c.u+=2,++c.l,++c.i);let s=!0;if(c.p()||(s=!1),0==s)return n;const r=t.j(301);return n=c.multiply(r),n}static ut(t){var n;let c=0,s=0,r=0,o=new e;const u=new e;34==t.O?(u.s+=2,++u.u,++u.l):56==t.O?(u.s+=2,++u.l):90==t.O&&(u.s+=3,u.o+=2,++u.u,++u.l);const i=new e,l=new e;622!=t.L&&623!=t.L&&624!=t.L||(u.s+=2,++u.l,++u.g,i.s=1,i.o=1,l.s=3,l.l=2,l.o=2);let f=!0;if(u.p()||(f=!1),0==f)return o;const a=t.j(310);if(o=u.multiply(a),i.p()){c=0;for(const e of null!==(n=t.T[310])&&void 0!==n?n:[]){e.level>=7&&c++}c>0&&o.add(i.multiply(c))}if(l.p()){s=0;for(const e of t.k){const t=e;r=t.m,(12==r||13==r)&&t.rn>=5&&++s}s>0&&o.add(l)}return o}static ge(t){let n=new e;const c=new e;34==t.O||56==t.O?++c.s:90==t.O&&(c.s+=2,++c.o);let s=!0;if(c.p()||(s=!1),0==s)return n;const r=t.j(119);return n=c.multiply(r),n}static it(t){let n=new e;const c=new e;87!=t.O&&91!=t.O||(c.s+=2,c.u+=2,++c.l,++c.i);let s=!0;if(c.p()||(s=!1),0==s)return n;const r=t.j(313);return n=c.multiply(r),n}static lt(t){let n=new e;const c=new e;87!=t.O&&91!=t.O||(++c.s,c.o+=3);let s=!0;if(c.p()||(s=!1),0==s)return n;const r=t.j(314);return n=c.multiply(r),n}static ft(t){const n=new e,c=new e;65!=t.O&&69!=t.O&&83!=t.O&&87!=t.O&&84!=t.O&&91!=t.O&&93!=t.O&&95!=t.O&&99!=t.O||(c.s+=2,c.l+=3,c.S+=4),87!=t.O&&91!=t.O||(++c.s,n.h=1);let s=!0;if(c.p()||(s=!1),0==s)return n;const r=t.j(315);return n.add(c.multiply(r)),n}static Rt(t){let n=new e;const c=new e;if(65!=t.O&&69!=t.O&&83!=t.O&&87!=t.O&&84!=t.O&&91!=t.O&&93!=t.O&&95!=t.O&&99!=t.O&&67!=t.O&&78!=t.O&&82!=t.O&&88!=t.O)return n;++c.s,++c.l,++c.u,95==t.O&&(++c.s,c.l+=2,c.u+=2);const s=t.j(358);return n=c.multiply(s),n}static pe(t){let n=0;const c=new e;let s=0;65!=t.O&&69!=t.O&&83!=t.O&&87!=t.O&&84!=t.O&&91!=t.O&&93!=t.O&&95!=t.O&&99!=t.O||(s=1);const r=t.R(171);let o=0;if(s>0){for(n=0;n<=10;)n>=5&&(o+=r[n]),n++;1==s&&(r[10]>0&&++c.s,o>0&&++c.l)}return c}static Zt(t){const n=new e;let c=!1;const s=new e;if(65==t.O||69==t.O||83==t.O||87==t.O||84==t.O||91==t.O||93==t.O||95==t.O||99==t.O?(s.s+=2,s.o+=4,c=!0):67==t.O||78==t.O||82==t.O||88==t.O?(++s.s,s.o+=2,c=!0):96==t.O&&(++s.s,++s.o,c=!0),0==c)return n;const r=t.j(376);return n.add(s.multiply(r)),n}static $t(t){const n=new e;return 65==t.O||69==t.O||83==t.O||87==t.O||84==t.O||91==t.O||93==t.O||95==t.O||99==t.O?(n.g+=2,++n.l,629==t.L&&(++n.g,n.l+=2)):67!=t.O&&78!=t.O&&82!=t.O&&88!=t.O&&96!=t.O||(++n.g,++n.l),n}static en(t){const n=new e;return 65==t.O||69==t.O||83==t.O||87==t.O||84==t.O||91==t.O||93==t.O||95==t.O||99==t.O?(n.g+=3,++n.l,629==t.L&&(++n.g,++n.l)):67==t.O||78==t.O||82==t.O||88==t.O?(n.g+=2,++n.l):96==t.O&&(++n.g,++n.l),n}static Me(t){const n=new e;return 65==t.O||69==t.O||83==t.O||87==t.O||84==t.O||91==t.O||93==t.O||95==t.O||99==t.O?(++n.u,n.l+=3,++n.S):67==t.O||78==t.O||82==t.O||88==t.O?(++n.u,n.l+=2):96==t.O&&(++n.u,++n.l),n}static Re(t){const n=new e;return 65==t.O||69==t.O||83==t.O||87==t.O||84==t.O||91==t.O||93==t.O||95==t.O||99==t.O?(n.s+=2,n.u+=2,n.l+=3,n.S+=2):67==t.O||78==t.O||82==t.O||88==t.O?(++n.s,++n.u,n.l+=2,++n.S):96==t.O&&(++n.s,++n.u,++n.l),n}static Be(t){let n=new e,c=!1,s=!1;147!=t.L&&73!=t.O&&81!=t.O||(c=!0),"ゆうばり"==t.q&&(s=!0);const r=new e;if((c||s)&&(r.s+=2,++r.i),!r.p())return n;const o=t.j(282);return n=r.multiply(o),n}static Ce(t){let n=new e,c=!1;147!=t.L&&73!=t.O&&81!=t.O||(c=!0);const s=new e;if(c&&(s.o+=3,++s.s,++s.i),!s.p())return n;const r=t.j(283);return n=s.multiply(r),n}static Z(t){let n=new e;const c=new e;if(["あさしも","はるかぜ","かみかぜ","やまかぜ","まいかぜ","しぐれ"].indexOf(t.q)>=0?(c.g+=3,c.l+=2,++c.s):["きしなみ","いそかぜ","はまかぜ","うしお","いかづち","やまぐも"].indexOf(t.q)>=0&&(c.g+=2,c.l+=2),!c.p())return n;const s=t.j(47);return n=c.multiply(s),n}static we(t){let n=new e;const c=new e;if([407,419,145,151,541].indexOf(t.L)>=0?(++c.s,c.u+=2,++c.i,c.l+=3):["おおよど","ひびき","かしま"].indexOf(t.q)>=0?(++c.u,++c.i,c.l+=3):["やはぎ","ゆきかぜ","いそかぜ","あさしも","はまかぜ","かすみ","すずつき"].indexOf(t.q)>=0&&(c.u+=2,++c.i,c.l+=2),!c.p())return n;const s=t.j(106);return n=c.multiply(s),n}static Se(t){let n=new e;let c=!1;const s=new e;if([66,28,12,1,5,10,23,18,30,38,22,54].indexOf(t.O)>=0?(s.s=1,s.o=2,s.l=2,s.g=2,s.S=1,c=!0):[21,4,20,16,34,56,41,52].indexOf(t.O)>=0?(s.s=1,s.o=2,s.l=2,s.S=3,c=!0):[7,13,29,8,9,31].indexOf(t.O)>=0&&(s.s=1,s.l=2,s.S=3,c=!0),0==c)return n;const r=t.j(129);return n=s.multiply(r),n}static _e(t){let n=new e;const c=new e;if(68==t.O&&(++c.s,c.u+=2,c.l+=3),!c.p())return n;const s=t.j(184);return n=c.multiply(s),n}static ye(t){let n=new e;const c=new e;if(68==t.O&&(c.s+=3,++c.u,++c.l),!c.p())return n;const s=t.j(188);return n=c.multiply(s),n}static me(t){let n=new e;const c=new e;if(68!=t.O&&63!=t.O||(++c.u,c.l+=2),!c.p())return n;const s=t.j(189);return n=c.multiply(s),n}static at(t){let n=new e;const c=new e;if(68==t.O&&(c.s+=4,++c.u,++c.l),!c.p())return n;const s=t.j(316);return n=c.multiply(s),n}static ke(t){let n=new e;const c=new e;if(70==t.O?(c.s+=3,c.l+=2,c.S+=2):72!=t.O&&62!=t.O||(++c.l,c.S+=2),392==t.L&&(++c.s,c.l+=2,c.S+=2),!c.p())return n;const s=t.j(194);return n=c.multiply(s),n}static X(t){let n=0,c=0;const s=new e;if(null=={11:1,18:1,7:1,10:1}[t.D])return s;let r=0;for(const e of t.k){const t=e;n=t.m,9==n&&(c=t.level,r<c&&(r=c))}return r>=2&&++s.S,r>=4&&++s.s,r>=6&&++s.S,r>=10&&(++s.s,++s.S),s}static ne(t){var n;let c=0;const s=new e;if(null==t.T[61])return s;let r=0;for(const e of null!==(n=t.T[61])&&void 0!==n?n:[]){c=e.level,r<c&&(r=c)}return 0==r||("そうりゅう"==t.q?(s.s+=3,s.S+=3):"ひりゅう"==t.q&&(s.s+=2,s.S+=2),508!=t.L&&509!=t.L&&560!=t.L||(++s.s,++s.S),r>=8&&197==t.L&&(++s.s,++s.S)),s}static Et(t){let n=0,c=new e;const s=new e,r=new e,o=new e;if(411==t.L||412==t.L?++s.s:82==t.L?(s.s+=2,s.u+=2,s.l+=2,o.u=2,o.l=3,o.P=1):553==t.L?(s.s+=2,s.u+=2,s.l+=2,s.P+=3,o.u=2,o.l=3,o.P=1,r.l=2,r.i=1):88==t.L?(s.s+=2,s.u+=2,s.l+=2,o.u=2,o.l=3,o.P=1):541==t.L||573==t.L?(s.s+=3,s.u+=2,++s.l,s.P+=2,r.s=2,r.l=2,r.i=1,r.P=1):554==t.L&&(s.s+=3,s.u+=2,s.l+=2,s.P+=3,o.u=2,o.l=3,o.P=1,r.s=1,r.l=2,r.i=1,r.P=1),!s.p())return c;const u=t.j(318);if(c=s.multiply(u),!r.p()&&!o.p())return c;let i=0;for(const e of t.k){const t=e;n=t.m,(12==n||13==n)&&t.on>=2&&++i}const l=t.j(290);return o.p()&&i>0&&0==l&&c.add(o),r.p()&&t.j(290)>=1&&c.add(r),c}static vt(t){let n=new e;const c=new e;if("こんごう"==t.q?(c.s=1,c.l=1,209==t.L||149==t.L?++c.s:591==t.L&&(c.s+=2,++c.o)):"ひえい"==t.q?(c.s=1,c.l=1,210==t.L||150==t.L?++c.s:592==t.L&&(c.s+=2,++c.u)):"はるな"==t.q?(c.s=1,c.l=1,211!=t.L&&151!=t.L||++c.s):"きりしま"==t.q?(c.s=1,c.l=1,212!=t.L&&152!=t.L||++c.s):("ふそう"==t.q||"やましろ"==t.q||"いせ"==t.q||"ひゅうが"==t.q)&&(c.s=1),!c.p())return n;const s=t.j(328);return n=c.multiply(s),n}static dt(t){let n=new e;const c=new e;if("こんごう"==t.q?(c.s=1,c.l=1,209==t.L?++c.s:149==t.L?(c.s+=2,++c.u):591==t.L&&(c.s+=3,++c.u,c.o+=2)):"ひえい"==t.q?(c.s=1,c.l=1,210==t.L?++c.s:150==t.L?(c.s+=2,++c.u):592==t.L&&(c.s+=3,++c.u,c.o+=2)):"はるな"==t.q?(c.s=1,c.l=1,211==t.L?++c.s:151==t.L&&(c.s+=2,++c.u)):"きりしま"==t.q?(c.s=1,c.l=1,212==t.L?++c.s:152==t.L&&(c.s+=2,++c.u)):("ふそう"==t.q||"やましろ"==t.q||"いせ"==t.q||"ひゅうが"==t.q)&&(c.s=1),!c.p())return n;const s=t.j(329);return n=c.multiply(s),n}static _t(t){let n=0,c=0,s=0,r=new e;if("コロラド"==t.q)return n=t.j(330),n>0&&(r.s+=1*n),c=t.j(331),c>0&&(r.s+=1*c,1496==t.L&&(r.s+=1*c,r.l+=1*c)),s=t.j(332),s>0&&(r.s+=1*s,1496==t.L&&(r.s+=1*s,r.l+=1*s,r.u+=1*s)),r;const o=new e;if(19==t.O?(o.s=1,(541==t.L||573==t.L)&&++o.s):88==t.O&&(o.s=1,576==t.L&&++o.s),!o.p())return r;const u=t.j(330)+t.j(331)+t.j(332);return r=o.multiply(u),r}static xt(t){let n=new e;const c=new e;return 6==t.O&&(++c.s,++c.u),149==t.L||591==t.L||592==t.L?(c.s+=2,c.u+=2):150==t.L?(++c.s,++c.u):151==t.L?(++c.s,++c.u,++c.l):152==t.L?(c.s+=2,++c.u):541==t.L?(++c.s,c.u+=2):573==t.L&&(c.s+=2,c.u+=2,++c.l),c.p()?(n=c.multiply(1),n):n}static Y(t){let n=new e;const c=new e;return 149==t.L||591==t.L||592==t.L?(++c.s,++c.u):150==t.L?++c.u:151==t.L?(++c.u,++c.l):152==t.L&&++c.s,c.p()?(n=c.multiply(1),n):n}static Pt(t){let n=new e;const c=new e;if(554==t.L?(c.g=2,c.l=1):553==t.L&&(c.g=1,c.l=1),!c.p())return n;const s=t.j(324)+t.j(325);return n=c.multiply(s),n}static ht(t){let n=new e;const c=new e;if(554==t.L?(c.s=1,c.g=3,c.l=2):553==t.L&&(c.g=2,c.l=1),!c.p())return n;const s=t.j(326);return n=c.multiply(s),n}static pt(t){let n=new e;const c=new e;if(554==t.L?(c.s=2,c.g=4,c.l=2):553==t.L&&(c.s=1,c.g=3,c.l=1),!c.p())return n;const s=t.j(327);return n=c.multiply(s),n}static St(t){let n=new e;const c=new e;if(554!=t.L&&553!=t.L||(c.s=5,c.u=2,c.l=2,c.g=1),!c.p())return n;const s=t.j(322);return n=c.multiply(s),n}static Ft(t){let n=new e;const c=new e;if(554!=t.L&&553!=t.L||(c.s=6,c.u=3,c.l=3,c.g=2),!c.p())return n;const s=t.j(323);return n=c.multiply(s),n}static wt(t){let n=new e;const c=new e;if(554!=t.L&&553!=t.L||(c.s=7,c.u=3,c.l=2),!c.p())return n;const s=t.j(319);return n=c.multiply(s),n}static yt(t){let n=new e;const c=new e;if(277==t.L||278==t.L?(c.u=1,c.l=1):594!=t.L&&599!=t.L||(c.u=2,c.l=1),!c.p())return n;const s=t.j(335);return n=c.multiply(s),n}static kt(t){let n=new e;const c=new e;if(277==t.L||278==t.L?(c.s=1,c.u=1,c.l=1):594!=t.L&&599!=t.L||(c.s=1,c.u=2,c.l=1),!c.p())return n;const s=t.j(336);return n=c.multiply(s),n}static Tt(t){let n=new e;const c=new e;if(277==t.L||278==t.L?(c.s=1,c.u=1,c.l=1):594!=t.L&&599!=t.L||(c.s=2,c.u=2,c.l=1),!c.p())return n;const s=t.j(337);return n=c.multiply(s),n}static At(t){let n=new e;const c=new e;if(277==t.L||278==t.L?(c.s=1,c.u=1,c.l=2):594==t.L?(c.s=1,c.u=2,c.l=3):599==t.L&&(c.s=4,c.u=3,c.l=4),!c.p())return n;const s=t.j(338);return n=c.multiply(s),n}static It(t){let n=new e;const c=new e;if(277==t.L||278==t.L?(c.s=1,c.u=2,c.l=2):594==t.L?(c.s=1,c.u=3,c.l=4):599==t.L&&(c.s=6,c.u=4,c.l=5),!c.p())return n;const s=t.j(339);return n=c.multiply(s),n}static U(t){let n=new e;const c=new e;if(277==t.L||278==t.L||156==t.L?c.s=1:594==t.L?(c.s=1,c.l=1):599==t.L&&(c.s=2,c.l=1),!c.p())return n;const s=t.j(18)+t.j(52);return n=c.multiply(s),n}static qt(t){let n=new e;const c=new e;if(277==t.L||278==t.L||461==t.L||466==t.L||462==t.L||467==t.L?c.s=1:594==t.L?(c.s=2,c.u=1,c.l=1):599==t.L&&(c.s=3,c.u=2,c.l=2),!c.p())return n;const s=t.j(342);return n=c.multiply(s),n}static Dt(t){let n=new e;const c=new e;if(277==t.L||278==t.L?c.s=2:461==t.L||466==t.L||462==t.L||467==t.L?c.s=1:594==t.L?(c.s=3,c.u=2,c.l=1):599==t.L&&(c.s=5,c.u=3,c.l=3),!c.p())return n;const s=t.j(343);return n=c.multiply(s),n}static Ot(t){let n=new e;const c=new e;if(599==t.L?c.s=3:555==t.L||560==t.L?(c.s=2,c.g=2):318==t.L?(c.s=4,c.g=1):282==t.L&&(c.s=2,c.g=1),!c.p())return n;const s=t.j(344);return n=c.multiply(s),n}static jt(t){let n=new e;const c=new e;if(599==t.L?(c.s=3,c.l=1):555==t.L||560==t.L?(c.s=3,c.g=2,c.l=2):318==t.L?(c.s=5,c.g=1,c.l=2):282==t.L&&(c.s=3,c.g=1,c.l=1),!c.p())return n;const s=t.j(345);return n=c.multiply(s),n}static Wt(t){const n=new e;let c=!1;const s=new e;if("しょうかく"==t.q?(s.s+=3,c=!0,n.o+=3,n.l+=3):"ずいかく"==t.q?(s.s+=2,c=!0,n.o+=3,n.l+=4):"たいほう"==t.q?(s.s+=2,c=!0,n.o+=3,n.l+=2):"じゅんよう"!=t.q&&"ひよう"!=t.q||(++s.s,c=!0,n.o+=2,n.l+=2),108==t.L||109==t.L?(++s.s,c=!0,++n.o):291==t.L||292==t.L?(++s.s,++s.g,c=!0,++n.o):296==t.L||297==t.L?(++s.s,++s.g,c=!0,++n.o,++n.l):116==t.L||74==t.L?(++s.s,++s.g,c=!0):117==t.L||282==t.L||185==t.L?(++s.s,s.g+=2,c=!0,++n.o,++n.l):560==t.L||555==t.L||318==t.L?(++s.s,s.g+=3,c=!0,++n.o,n.l+=2):508!=t.L&&509!=t.L||(++s.s,s.g+=2,c=!0,n.o+=2,n.l+=3),0==c)return n;const r=t.j(374);return n.add(s.multiply(r)),n}static Vt(t){const n=new e;let c=!1;const s=new e;if("しょうかく"==t.q?(s.s+=2,c=!0,n.o+=2,n.l+=2):"ずいかく"==t.q?(++s.s,c=!0,n.o+=2,n.l+=3):"たいほう"==t.q?(++s.s,c=!0,n.o+=2,n.l+=2):"じゅんよう"!=t.q&&"ひよう"!=t.q||(++s.s,c=!0,++n.o,++n.l),108==t.L||109==t.L?(++s.s,c=!0):291==t.L||292==t.L?(++s.s,c=!0,++n.o):296==t.L||297==t.L?(++s.s,c=!0,++n.o,++n.l):116==t.L||74==t.L?(++s.g,c=!0):117==t.L||282==t.L||185==t.L?(++s.s,++s.g,c=!0,++n.o):560==t.L||555==t.L||318==t.L?(++s.s,s.g+=2,c=!0,++n.o,++n.l):508!=t.L&&509!=t.L||(++s.s,c=!0,n.o+=2,n.l+=2),0==c)return n;const r=t.j(373);return n.add(s.multiply(r)),n}static Ut(t){const n=new e;let c=!1;const s=new e;if("しょうかく"==t.q||"ずいかく"==t.q||"たいほう"==t.q?(++s.s,c=!0,++n.o):"じゅんよう"!=t.q&&"ひよう"!=t.q||(++s.s,c=!0),108==t.L||109==t.L||291==t.L||292==t.L||296==t.L||297==t.L?(++s.s,c=!0):116==t.L||74==t.L||117==t.L||282==t.L||185==t.L?(++s.g,c=!0):560==t.L||555==t.L||318==t.L?(++s.g,c=!0,++n.o):508!=t.L&&509!=t.L||(++s.s,c=!0),0==c)return n;const r=t.j(372);return n.add(s.multiply(r)),n}static Yt(t){let n=new e,c=!1;const s=new e;if(69!=t.O&&83!=t.O&&84!=t.O||(s.u+=3,s.s+=3,s.l+=3,s.g+=3,c=!0),"かが"==t.q&&(++s.u,++s.s,++s.l,++s.g,c=!0),0==c)return n;const r=t.j(375);return n=s.multiply(r),n}static Lt(t){let n=new e;const c=new e;if("ガリバルディ"!=t.q&&"アブルッツィ"!=t.q||(c.s=1,c.u=1,c.l=1),!c.p())return n;const s=t.j(340);return n=c.multiply(s),n}static bt(t){let n=new e;const c=new e;if("ガリバルディ"==t.q||"アブルッツィ"==t.q?(c.s=2,c.u=1,c.l=1):"ゴトランド"==t.q&&(c.s=1,c.u=1,c.l=1),!c.p())return n;const s=t.j(341);return n=c.multiply(s),n}static V(t){let n=new e;const c=new e;if("ほうしょう"==t.q&&(c.s=2,c.l=2,c.g=2,c.u=2),75!=t.O&&76!=t.O||(c.s=2,c.g=3),7==t.D&&(++c.u,++c.l),!c.p())return n;const s=t.j(19);return n=c.multiply(s),n}static Ae(t){let n=new e;const c=new e;if("ほうしょう"==t.q&&(c.s=3,c.l=4,c.g=4,c.u=3),75!=t.O&&76!=t.O||(c.s=2,c.g=5,c.u=1,c.l=1),7==t.D&&(c.g+=2,++c.u,++c.l),!c.p())return n;const s=t.j(228);return n=c.multiply(s),n}static Ht(t){const n=new e;let c=!1;const s=new e;if("ゴトランド"==t.q&&(s.s=4,s.g=3,s.l=2,s.S=3,c=!0,630==t.L&&(n.s+=2,n.o+=2,++n.l,++n.S)),70==t.O?(s.s=2,s.g=3,s.l=1,s.S=2,c=!0):72==t.O||62==t.O?(++s.s,s.g+=2,++s.l,s.S+=2,c=!0):67!=t.O&&78!=t.O&&82!=t.O&&88!=t.O||(s.s+=2,s.g+=2,s.l+=2,s.S+=2,c=!0),0==c)return n;const r=t.j(368);return n.add(s.multiply(r)),n}static Gt(t){const n=new e;let c=!1;const s=new e;if("ゴトランド"==t.q&&(s.s+=2,++s.g,++s.l,++s.S,c=!0),70==t.O?(++s.s,++s.g,++s.l,++s.S,c=!0):72==t.O||62==t.O?(++s.s,++s.l,++s.S,c=!0):67!=t.O&&78!=t.O&&82!=t.O&&88!=t.O||(s.s+=2,s.l+=2,s.S+=2,c=!0),0==c)return n;const r=t.j(367);return n.add(s.multiply(r)),n}static Jt(t){const n=new e;let c=!1;const s=new e;if("ゴトランド"==t.q&&(s.s=5,s.g=4,s.l=4,s.S=3,c=!0,630==t.L&&(n.s+=3,n.o+=3,n.l+=2,n.S+=2)),70==t.O?(s.s+=3,s.g+=3,s.l+=2,s.S+=3,c=!0):72==t.O||62==t.O?(s.s+=2,s.g+=2,++s.l,s.S+=2,c=!0):67!=t.O&&78!=t.O&&82!=t.O&&88!=t.O||(s.s+=2,s.g+=2,s.l+=2,s.S+=2,c=!0),0==c)return n;const r=t.j(369);return n.add(s.multiply(r)),n}static Kt(t){const n=new e;let c=!1;const s=new e;if("ゴトランド"==t.q&&(s.s=1,s.g=3,s.l=1,s.S=2,c=!0),70==t.O?(++s.s,s.g+=3,++s.l,++s.S,c=!0):72==t.O||62==t.O?(++s.s,s.g+=2,++s.l,++s.S,c=!0):67!=t.O&&78!=t.O&&82!=t.O&&88!=t.O||(s.s+=2,s.g+=3,s.l+=2,s.S+=2,c=!0,"ウォースパイト"==t.q&&(n.s+=4,++n.l,++n.S)),0==c)return n;const r=t.j(370);return n.add(s.multiply(r)),n}static Qt(t){const n=new e;let c=!1;const s=new e;if("ゴトランド"==t.q&&(s.s=4,s.g=2,s.l=3,s.S=6,c=!0,630==t.L&&(n.s+=2,n.l+=2,n.S+=3)),70==t.O?(s.s+=2,++s.g,s.l+=2,s.S+=4,c=!0):79==t.O?(s.s+=2,++s.l,s.S+=3,c=!0):67!=t.O&&78!=t.O&&82!=t.O&&88!=t.O||(s.s+=3,++s.g,s.l+=2,s.S+=3,c=!0,88==t.O&&(n.s+=3,n.l+=2,n.S+=2)),0==c)return n;const r=t.j(371);return n.add(s.multiply(r)),n}static Mt(t){let n=new e;const c=new e;if(95==t.O?c.s=2:9==t.O&&(c.s=1),!c.p())return n;const s=t.j(356)+t.j(357);return n=c.multiply(s),n}static Bt(t){let n=new e;const c=new e;if("パース"==t.q?(c.s=2,c.u=2,c.l=1):"ゆうばり"==t.q&&(c.s=1,c.u=1,c.l=1),622!=t.L&&623!=t.L&&624!=t.L||(++c.s,++c.u),!c.p())return n;const s=t.j(359);return n=c.multiply(s),n}static Ct(t){let n=new e;const c=new e;if("デ・ロイテル"==t.q?(c.s=2,c.u=2,c.l=1):"ゴトランド"==t.q&&(c.s=2,c.u=1,c.l=1),41==t.O&&(c.s=1,c.u=1),!c.p())return n;const s=t.j(360)+t.j(361);return n=c.multiply(s),n}static Nt(t){let n=new e;const c=new e;let s=!1;if(99==t.O?(c.s=1,c.u=2,c.l=1,s=!0):34==t.O||21==t.O?(c.s=-3,c.u=-3,c.l=-8,s=!0):4==t.O||20==t.O||16==t.O?(c.s=-3,c.u=-2,c.l=-6,s=!0):89==t.O||56==t.O?(c.s=-2,c.u=-1,c.l=-4,s=!0):52!=t.O&&41!=t.O&&98!=t.O||(c.u=-1,c.l=-2,s=!0),65!=t.O&&69!=t.O&&83!=t.O&&87!=t.O&&84!=t.O&&91!=t.O&&93!=t.O&&95!=t.O&&99!=t.O||(++c.u,++c.l,s=!0),0==s)return n;const r=t.j(362)+t.j(363);return n=c.multiply(r),n}static Xt(t){let n=new e;const c=new e;623==t.L||586==t.L||119==t.L||118==t.L?(c.o=1,c.l=-2,119==t.L?++c.o:623==t.L&&(++c.s,c.o+=3)):(c.s=-1,c.l=-7);const s=t.j(364);return n=c.multiply(s),n}static ze(t){let n=new e;const c=new e;let s=!1;if(488!=t.L&&141!=t.L&&160!=t.L&&624!=t.L||(c.g=1,c.l=1,s=!0),0==s)return n;const r=t.j(287);return n=c.multiply(r),n}static Ge(t){let n=new e;const c=new e;let s=!1;if(488==t.L||141==t.L||160==t.L?(c.g=2,c.l=1,s=!0):624==t.L&&(c.s=1,c.g=3,c.l=2,s=!0),0==s)return n;const r=t.j(288);return n=c.multiply(r),n}static he(t){let n=new e;const c=new e;let s=!1;return 488==t.L||141==t.L||160==t.L||622==t.L||623==t.L?(c.g=1,c.l=3,s=!0):624==t.L&&(c.g=3,c.l=5,s=!0),54==t.O&&(c.g=1,c.l=2,s=!0),0==s||(n=c.multiply(1)),n}static zt(t){let n=new e;const c=new e;let s=!1;if(37!=t.O&&19!=t.O&&2!=t.O&&26!=t.O&&6!=t.O||(++c.s,s=!0),136!=t.L&&148!=t.L&&546!=t.L&&541!=t.L&&573!=t.L||(++c.s,s=!0),591!=t.L&&592!=t.L||(c.s+=2,s=!0),0==s)return n;return n=c.multiply(1),n}static tn(t){let n=0,c=0,s=0;const r=new e,o=new e;let u=!1;1==t.D?(o.u+=2,++o.s,u=!0):21!=t.D&&16!=t.D||(++o.u,++o.s,u=!0),66!=t.O&&28!=t.O||(++o.s,o.u+=2,u=!0),"ゆら"==t.q||"なか"==t.q||"きぬ"==t.q||"いすず"==t.q?(o.s+=2,u=!0):"おおい"!=t.q&&"きたかみ"!=t.q||(o.u+=2,o.s+=2,u=!0),"ゆら"!=t.q&&"なか"!=t.q&&"きぬ"!=t.q&&"いすず"!=t.q&&"ゆうばり"!=t.q||(++o.g,u=!0),"てんりゅう"!=t.q&&"たつた"!=t.q&&"ゆうばり"!=t.q||(++o.s,u=!0),488==t.L?(o.u+=4,u=!0):220==t.L?(o.u+=3,u=!0):23==t.L?(o.u+=2,u=!0):160==t.L||487==t.L||141==t.L?(o.u+=3,u=!0):224==t.L||289==t.L||219==t.L?(o.u+=2,u=!0):56!=t.L&&113!=t.L&&22!=t.L||(o.u+=2,u=!0),488!=t.L&&160!=t.L&&487!=t.L&&141!=t.L||(++o.g,u=!0),477!=t.L&&478!=t.L&&624!=t.L||(o.g+=2,u=!0),477!=t.L&&478!=t.L&&624!=t.L&&622!=t.L||(o.u+=2,u=!0),u&&(n=t.j(379),r.add(o.multiply(n)));const i=new e;let l=!1;if(16==t.D||3==t.D||4==t.D||21==t.D?(++i.s,i.l+=2,l=!0):1==t.D&&(++i.s,i.l+=4,l=!0),66!=t.O&&28!=t.O&&21!=t.O&&34!=t.O||(i.s+=2,i.l+=3,l=!0),488==t.L?(i.s+=2,i.l+=2,l=!0):487!=t.L&&160!=t.L&&141!=t.L&&118!=t.L&&119!=t.L||(++i.s,++i.l,l=!0),l){c=0;for(const e of t.k){const t=e;s=t.m,(12==s||13==s)&&t.rn>=5&&++c}c>0&&r.add(i)}return r}static nn(t){let n=0,c=0,s=0;const r=new e,o=new e;let u=!1;21!=t.D&&16!=t.D||(o.u+=2,++o.s,u=!0),"ゆら"==t.q||"なか"==t.q||"きぬ"==t.q||"いすず"==t.q?(o.s+=2,u=!0):"おおい"!=t.q&&"きたかみ"!=t.q||(o.u+=2,o.s+=3,u=!0),"ゆら"!=t.q&&"なか"!=t.q&&"きぬ"!=t.q&&"いすず"!=t.q&&"ゆうばり"!=t.q||(++o.g,u=!0),"てんりゅう"!=t.q&&"たつた"!=t.q&&"ゆうばり"!=t.q||(++o.s,u=!0),488==t.L?(o.u+=4,u=!0):220==t.L?(o.u+=3,u=!0):23==t.L?(o.u+=2,u=!0):160==t.L||487==t.L||141==t.L?(o.u+=3,u=!0):224==t.L||289==t.L||219==t.L?(o.u+=2,u=!0):56!=t.L&&113!=t.L&&22!=t.L||(o.u+=2,u=!0),488!=t.L&&160!=t.L&&487!=t.L&&141!=t.L||(++o.g,u=!0),477!=t.L&&478!=t.L&&624!=t.L||(o.g+=2,u=!0),477!=t.L&&478!=t.L&&624!=t.L&&622!=t.L||(o.u+=2,u=!0),u&&(n=t.j(380),r.add(o.multiply(n)));const i=new e;let l=!1;if(16!=t.D&&3!=t.D&&4!=t.D&&21!=t.D||(i.s+=2,++i.l,l=!0),488!=t.L&&487!=t.L&&160!=t.L&&141!=t.L&&118!=t.L&&119!=t.L||(++i.s,i.l+=2,l=!0),l){c=0;for(const e of t.k){const t=e;s=t.m,(12==s||13==s)&&t.rn>=5&&++c}c>0&&r.add(i)}return r}static cn(t){var n;let c=0;const s=new e,r=new e;let o=!1,u=0;if(65!=t.O&&69!=t.O&&83!=t.O&&87!=t.O&&84!=t.O&&91!=t.O&&93!=t.O&&95!=t.O&&99!=t.O||(++r.s,o=!0,u=1),0==o)return s;if(o&&(c=t.j(381),s.add(r.multiply(c))),0==u)return s;t.R(381);let i=0;for(const e of null!==(n=t.T[381])&&void 0!==n?n:[]){e.level>=6&&i++}return 1==u&&(s.s+=1*i),s}static sn(t){let n=0;const c=new e,s=new e;let r=!1,o=!1;const u=new e,i=new e;if(1==t.D&&(s.u+=2,s.l+=2,++s.g,r=!0,u.s+=2,u.l+=3,i.u+=2,i.l+=3,o=!0),66!=t.O&&28!=t.O||(s.u+=2,++s.l,r=!0,++u.s,u.l+=2,i.u+=2,i.l+=2,o=!0),"ゆら"!=t.q&&"なか"!=t.q&&"きぬ"!=t.q||(++s.u,r=!0),488==t.L||220==t.L?(++s.l,r=!0,488==t.L&&(++u.s,++u.l,i.u+=2,i.l+=2,o=!0)):160==t.L||224==t.L?(++s.l,r=!0,160==t.L&&(++u.s,++u.l,i.u+=2,i.l+=2,o=!0)):487!=t.L&&289!=t.L||(++s.l,r=!0,487==t.L&&(++u.s,++u.l,i.u+=2,i.l+=2,o=!0)),0==r)return c;const l=t.j(382);if(c.add(s.multiply(l)),0==o)return c;let f=0,a=0;for(const e of t.k){const t=e;n=t.m,12!=n&&13!=n||(t.rn>=5&&++f,t.on>=2&&++a)}return f>0&&c.add(u),a>0&&c.add(i),c}static Te(t){let n=0;const c=new e;if(591!=t.L&&592!=t.L)return c;++c.i,++c.o;const s=t.R(204);let r=0;for(n=0;n<=10;)n>=7&&(r+=s[n]),n++;return r>0&&++c.i,s[10]>0&&++c.o,c}static ue(t){let n=0;const c=new e;if(591!=t.L&&592!=t.L)return c;c.l+=2,++c.o;const s=t.R(87);let r=0,o=0;for(n=0;n<=10;)n>=6&&(r+=s[n]),n>=8&&(o+=s[n]),n++;return r>0&&++c.l,o>0&&++c.o,s[10]>0&&++c.s,c}}class s{constructor(e){this.un=e}get _(){return this.un.gearId}get in(){return 0}get ln(){return this.un.name}get level(){return this.un.star}fn(){return!1}get an(){return this.un.proficiency.level}get xn(){return 0}get m(){const{categoryId:e}=this.un;return 38===e?3:93===e?13:94===e?9:e}get En(){return 128==this._?38:142==this._?43:281==this._?38:this.m}get wn(){return 0}get gn(){return this.un.iconId}get Sn(){return this.un.range}get Fn(){return this.un.firepower}get Pn(){return this.un.torpedo}get on(){return this.un.antiAir}get hn(){return this.un.asw}get pn(){return this.un.bombing}get vn(){return this.un.accuracy}get dn(){return this.un.evasion}get rn(){return this.un.los}get _n(){return this.un.armor}yn(){return this.un.radius}}exports.createEquipmentBonus=e=>{const t=e.gears.map(e=>e&&new s(e)).filter(e=>Boolean(e)),n=c.B(e,t);return{firepower:n.s,torpedo:n.o,antiAir:n.u,armor:n.i,evasion:n.l,asw:n.g,los:n.S,accuracy:n.P,range:n.h}};