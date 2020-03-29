"use strict";Object.defineProperty(exports,"t",{value:!0});class e{constructor(){this.l=0,this.u=0,this.s=0,this.i=0,this.o=0,this.g=0,this.S=0,this.F=0,this.P=0,this.h=0}add(t){return e.keys.forEach(e=>{this[e]+=t[e]}),this}multiply(t){return e.keys.forEach(e=>{this[e]*=t}),this}p(){return e.keys.some(e=>0!==this[e])}}e.keys=Object.keys(new e);const t=(e,t,n)=>{var r;const c=(null!==(r=e[t])&&void 0!==r?r:0)+n;e[t]=c};class n{constructor(e,n){this.v=10;const r={},c={},l={};for(let e of n){if(!e)continue;const{_:n,m:u}=e,s=r[n];Array.isArray(s)?s.push(e):r[n]=[e],t(c,n,1),t(l,u,1)}this.k=n.concat(),this.T=r,this.A=c,this.L=l,this.q=e.shipId,this.D=e.ruby,this.I=e.shipTypeId,this.O=e.shipClassId}j(e){var t;return null!==(t=this.A[e])&&void 0!==t?t:0}M(e){var t;return null!==(t=this.L[e])&&void 0!==t?t:0}R(e){const n=this.T[e],r=Array(11).fill(0);if(!n)return r;for(let e of n)t(r,e.level,1);return r}}class r extends Object{static B(t,c){let l,u=new n(t,c),s=[];s.push({C:u.M(9),N:r.X},{C:u.M(29),N:r.G},{C:u.M(42),N:r.H},{C:u.M(12)||u.M(13),N:r.J},{C:u.j(15),N:r.K},{C:u.j(18)||u.j(52),N:r.U},{C:u.j(19),N:r.V},{C:u.j(24)||u.j(57)||u.j(111),N:r.W},{C:u.j(35),N:r.Y},{C:u.j(47),N:r.Z},{C:u.j(50),N:r.$},{C:u.j(58),N:r.ee},{C:u.j(61),N:r.te},{C:u.j(61),N:r.ne},{C:u.j(63),N:r.re},{C:u.j(67),N:r.ce},{C:u.j(79)||u.j(81),N:r.le},{C:u.j(82),N:r.ue},{C:u.j(90),N:r.se},{C:u.j(93),N:r.ie},{C:u.j(94),N:r.fe},{C:u.j(99),N:r.oe},{C:u.j(100),N:r.ae},{C:u.j(104),N:r.xe},{C:u.j(106),N:r.Ee},{C:u.j(119),N:r.we},{C:u.j(129),N:r.ge},{C:u.j(143),N:r.Se},{C:u.j(144),N:r.Fe},{C:u.j(149),N:r.Pe},{C:u.j(184),N:r.he},{C:u.j(188),N:r.pe},{C:u.j(189),N:r.ve},{C:u.j(194),N:r._e},{C:u.j(228),N:r.de},{C:u.j(237),N:r.me},{C:u.j(266),N:r.ye},{C:u.j(266),N:r.ke},{C:u.j(267)||u.j(366),N:r.Te},{C:u.j(267)||u.j(366),N:r.Ae},{C:u.j(268),N:r.Le},{C:u.j(282),N:r.be},{C:u.j(283),N:r.qe},{C:u.j(285),N:r.De},{C:u.j(286),N:r.Ie},{C:u.j(289),N:r.Oe},{C:u.j(290),N:r.je},{C:u.j(291),N:r.Me},{C:u.j(292),N:r.Re},{C:u.j(229),N:r.Be},{C:u.j(179),N:r.Ce},{C:u.j(174),N:r.Ne},{C:u.j(287),N:r.Xe},{C:u.j(288),N:r.ze},{C:u.j(293),N:r.Ge},{C:u.j(294),N:r.He},{C:u.j(295),N:r.Je},{C:u.j(296),N:r.Ke},{C:u.j(297),N:r.Qe},{C:u.j(298)||u.j(299)||u.j(300),N:r.Ue},{C:u.j(301),N:r.Ve},{C:u.j(302),N:r.We},{C:u.j(303),N:r.Ye},{C:u.j(304),N:r.Ze},{C:u.j(305)||u.j(306),N:r.$e},{C:u.j(307),N:r.et},{C:u.j(308),N:r.tt},{C:u.j(310),N:r.nt},{C:u.j(313),N:r.rt},{C:u.j(314),N:r.ct},{C:u.j(315),N:r.lt},{C:u.j(316),N:r.ut},{C:u.j(317),N:r.st},{C:u.j(318),N:r.it},{C:u.j(319),N:r.ft},{C:u.j(320),N:r.ot},{C:u.j(322),N:r.at},{C:u.j(323),N:r.xt},{C:u.j(324)||u.j(325),N:r.Et},{C:u.j(326),N:r.wt},{C:u.j(327),N:r.gt},{C:u.j(328),N:r.St},{C:u.j(329),N:r.Ft},{C:u.j(330)||u.j(331)||u.j(332),N:r.Pt},{C:u.j(335),N:r.ht},{C:u.j(336),N:r.pt},{C:u.j(337),N:r.vt},{C:u.j(338),N:r._t},{C:u.j(339),N:r.dt},{C:u.j(340),N:r.yt},{C:u.j(341),N:r.kt},{C:u.j(342),N:r.Tt},{C:u.j(343),N:r.At},{C:u.j(344),N:r.Lt},{C:u.j(345),N:r.bt},{C:u.j(356)||u.j(357),N:r.qt},{C:u.j(358),N:r.Dt},{C:u.j(359),N:r.It},{C:u.j(360)||u.j(361),N:r.Ot},{C:u.j(362)||u.j(363),N:r.jt},{C:u.j(364),N:r.Mt},{C:u.j(365),N:r.Rt},{C:u.j(367),N:r.Bt},{C:u.j(368),N:r.Ct});let i=new e;for(let e of s){let t=e;t.C&&(l=t.N.call(null,u),i.add(l))}return i}static Le(t){let n=new e;return"きそ"!=t.D&&"たま"!=t.D||(n.o=7,n.i=2),n}static G(t){let n=new e,r=t.M(29);return"ひえい"==t.D||"きりしま"==t.D||"ちょうかい"==t.D||"じんつう"==t.D||"あかつき"==t.D?(n.l+=4,--n.o):"あきぐも"==t.D?n.l+=2*r:"ゆきかぜ"==t.D&&(n.l+=r,n.s+=r),"じんつう"==t.D&&(n.u+=6,n.l+=4),n}static H(t){let n=new e;return"ひえい"==t.D||"きりしま"==t.D?(n.l+=6,n.o-=2):"やまと"!=t.D&&"むさし"!=t.D||(n.l+=4,--n.o),n}static J(t){let n=0,r=new e,c=0;if(569!=t.q)return r;c=1;let l=0;for(let e of t.k){let t=e;n=t.m,12!=n&&13!=n||(t.Nt,t.Xt>=2&&++l)}return l>0&&1==c&&(++r.l,r.o+=3,r.s+=2),r}static Te(t){let n=new e,r=0,c=0;if(38==t.O||22==t.O)r=2,c=1;else{if(30!=t.O)return n;r=1,c=1}let l=t.j(267)+t.j(366);return n.l=r*l,n.o=c*l,n}static Ae(t){let n=0,r=new e,c=t.j(267),l=t.j(366),u=c+l;if(566!=t.q&&567!=t.q&&568!=t.q||(c>0&&++r.l,1==l?(++r.l,r.s+=2):l>=2&&(r.l+=2,r.s+=4)),38!=t.O&&229!=t.q)return r;let s=!1,i=!1,f=!1,o=!1,a=!1,x=!1,E=!1;543==t.q?(r.l=1*u,s=!0):229==t.q?i=!0:542==t.q?(r.l=1*u,f=!0):563==t.q?(r.l=1*u,o=!0):564==t.q?(r.l=1*u,a=!0):578==t.q?(r.l=1*u,x=!0):569==t.q&&(r.l=1*u,E=!0);let w=0,g=0;for(let e of t.k){let t=e;n=t.m,12!=n&&13!=n||(t.Nt>=5&&++w,t.Xt>=2&&++g)}return w>0&&c>0&&(38==t.O&&(r.l+=2,++r.u,0==s&&0==f&&0==o&&0==a&&0==x&&0==E&&(r.u+=2),++r.o),(f||s||i||o||a||x||E)&&(++r.l,r.u+=3,r.o+=2)),l>0&&(f||s||o||a||x||i||E)&&(1==l?r.s+=3:l>=2&&(r.s+=5),E&&(++r.l,r.s+=2),w>0&&(r.l+=2,r.o+=2,r.u+=4),g>0&&(++r.l,r.o+=2,r.s+=5)),r}static K(t){let n=new e,r=!1;if(566!=t.q&&567!=t.q&&568!=t.q||(r=!0),0==r)return n;let c=t.j(15);return 30==t.O&&(1==c?n.u=2:c>=2&&(n.u=4)),n}static De(t){let n=new e,r=!1;if([195,426,420,407,437,326,419,147,627].indexOf(t.q)>=0&&(r=!0),0==r)return n;let c=t.R(285),l=t.j(285);l>2&&(l=2),n.u=2*l,n.o=1*l;let u=c[10];return 1==u?++n.l:u>=2&&(n.l+=2),n}static Ie(t){let n=0,r=new e,c=!1;if([566,145,498,144,469,463,468,199,489,490,464,470,198,543,567,568,497,542,563,564,587,578,569].indexOf(t.q)>=0&&(c=!0),0==c)return r;let l=t.R(286),u=t.j(286);u>2&&(u=2);r.u=2*u,r.o=1*u;let s=l[10];return 1==s?++r.l:s>=2&&(r.l+=2),30==t.O&&(n=l[5]+l[6]+l[7]+l[8]+l[9]+l[10],1==n?++r.u:n>=2&&(r.u+=2)),r}static ye(t){let n=new e,r=!1;if(566!=t.q&&567!=t.q&&568!=t.q||(r=!0),0==r)return n;let c=t.j(266);return 30==t.O&&(1==c?n.l=1:c>=2&&(n.l=3)),n}static ke(t){let n=0,r=new e,c=0,l=new e;if(23==t.O||18==t.O?(l.l=1,c=1):30==t.O&&(l.l=1,c=2),("しぐれ"==t.D||"ゆきかぜ"==t.D||"いそかぜ"==t.D)&&(l.o=1),!l.p())return r;let u=t.j(266);if(r=l.multiply(u),0==c)return r;let s=0;for(let e of t.k){let t=e;n=t.m,(12==n||13==n)&&t.Nt>=5&&++s}return s>0&&(1==c?(++r.l,++r.o,r.u+=3):2==c&&(r.l+=2,++r.o,r.u+=3)),r}static xe(t){let n=new e,r=new e;if(149==t.q)r.l=2;else if(150==t.q)r.l=1;else if(152==t.q)r.l=1;else{if(151!=t.q)return n;r.l=2,r.s=1,r.o=2}let c=t.j(104);return n=r.multiply(c),n}static Oe(t){let n=0,r=new e,c=0,l=new e;if(149==t.q)l.l=2,l.s=1,c=1;else if(150==t.q)l.l=1;else if(152==t.q)l.l=1;else{if(151!=t.q)return r;l.l=2,l.s=2,l.o=2,c=1}let u=t.j(289);if(r=l.multiply(u),0==c)return r;let s=0;for(let e of t.k){let t=e;n=t.m,(12==n||13==n)&&t.Nt>=5&&++s}return s>0&&(r.l+=2,r.o+=2),r}static je(t){let n=0,r=new e,c=0,l=new e;if(411==t.q)l.l=1;else if(412==t.q)l.l=1;else if(82==t.q)l.l=2,l.s=2,l.o=1,c=1;else if(553==t.q)l.l=3,l.s=2,l.o=1,l.P=3,c=1;else if(88==t.q)l.l=2,l.s=2,l.o=1,c=1;else{if(554!=t.q)return r;l.l=3,l.s=2,l.o=2,l.P=3,c=1}let u=t.j(290);if(r=l.multiply(u),0==c)return r;let s=0;for(let e of t.k){let t=e;n=t.m,(12==n||13==n)&&t.Xt>=2&&++s}return s>0&&(r.s+=2,r.o+=3),r}static Re(t){let n=new e,r=new e;if(553==t.q)r.l=8,r.o=2,r.s=1;else{if(554!=t.q)return n;r.l=8,r.o=2,r.s=1}let c=t.j(292);return n=r.multiply(c),n}static Me(t){let n=new e,r=new e;if(553==t.q)r.l=6,r.o=1;else{if(554!=t.q)return n;r.l=6,r.o=1}let c=t.j(291);return n=r.multiply(c),n}static me(t){let n=new e,r=new e;if(553==t.q)r.l=4,r.o=2;else if(82==t.q)r.l=3,r.o=1;else if(88==t.q)r.l=3,r.o=1;else if(554==t.q)r.l=4,r.o=2;else if(411==t.q)r.l=2;else{if(412!=t.q)return n;r.l=2}let c=t.j(237);return n=r.multiply(c),n}static le(t){let n=new e,r=new e;if(553==t.q)r.l=3;else if(82==t.q)r.l=2;else if(88==t.q)r.l=2;else if(554==t.q)r.l=3;else if(411==t.q)r.l=2;else{if(412!=t.q)return n;r.l=2}let c=t.j(79)+t.j(81);return n=r.multiply(c),n}static Be(t){var n;let r=0,c=0,l=new e,u=0;for(let e of null!==(n=t.T[229])&&void 0!==n?n:[]){e.level>=7&&u++}let s=u,i=0,f=0,o=0;if(622==t.q||623==t.q||624==t.q)r=t.j(229),l.l+=1*r,l.s+=1*r,i=2;else if(0==u)return l;if(488==t.q?(l.s+=3*s,i=1):220==t.q?l.s+=2*s:23==t.q?l.s+=1*s:160==t.q?(l.s+=2*s,i=1):224==t.q?l.s+=1*s:487==t.q?(l.s+=2*s,i=1):289==t.q&&(l.s+=1*s),(66==t.O||28==t.O)&&(l.l+=1*s,l.s+=1*s,f=1),1==t.I&&(l.l+=1*s,l.s+=1*s,o=1),("ゆら"==t.D||"なか"==t.D||"きぬ"==t.D)&&(l.l+=2*s),0==i+f+o)return l;let a=0,x=0;for(let e of t.k){let t=e;c=t.m,12!=c&&13!=c||(t.Nt>=5&&++a,t.Xt>=2&&++x)}return 1==i?a>0&&(l.l+=3,l.o+=2):2==i&&(a>0&&(++l.l,++l.o),x>0&&(l.s+=2,l.o+=2)),1==f&&a>0&&(l.l+=2,l.o+=3),1==o&&a>0&&(++l.l,l.o+=4),l}static ce(t){let n=new e,r=new e;if(13!=t.I&&14!=t.I&&(r.u=-5),!r.p())return n;let c=t.j(67);return n=r.multiply(c),n}static ee(t){let n=new e,r=new e;if("しまかぜ"!=t.D&&4!=t.I&&54!=t.O||(r.u=1),!r.p())return n;let c=t.j(58);return n=r.multiply(c),n}static Ce(t){let n=new e,r=new e;if(54==t.O&&(r.u=1),!r.p())return n;let c=t.j(179);return n=r.multiply(c),n}static Ne(t){let n=new e,r=new e;if(66==t.O&&(r.u=1,r.o=2),591==t.q?(r.u+=6,r.o+=3):488!=t.q&&622!=t.q&&623!=t.q&&624!=t.q||(r.l+=2,r.u+=4,r.o+=4),!r.p())return n;let c=t.j(174);return n=r.multiply(c),n}static $e(t){let n=new e,r=new e;if(76==t.O&&(r.g=1,r.o=1),"しんよう"==t.D?(r.g+=2,++r.o):"グラーフ・ツェッペリン"!=t.D&&"アクィラ"!=t.D||(r.l=1,r.o=1),!r.p())return n;let c=t.j(305)+t.j(306);return n=r.multiply(c),n}static ue(t){let n=new e,r=new e;if(76==t.O&&(r.g=1,r.o=1),!r.p())return n;let c=t.j(82);return n=r.multiply(c),n}static We(t){let n=new e,r=new e;if(76==t.O&&(r.g=1,r.o=1),!r.p())return n;let c=t.j(302);return n=r.multiply(c),n}static Ye(t){let n=new e,r=new e;if(16==t.O||4==t.O||20==t.O||41==t.O?(r.l=1,r.s=1):89==t.O&&(r.l=1,r.s=2,r.o=1),!r.p())return n;let c=t.j(303);return n=r.multiply(c),n}static et(t){let n=new e,r=new e;if(65!=t.O&&69!=t.O&&83!=t.O&&87!=t.O&&84!=t.O&&91!=t.O&&93!=t.O&&95!=t.O&&99!=t.O||(r.l=1,r.s=1,r.o=1),!r.p())return n;let c=t.j(307);return n=r.multiply(c),n}static tt(t){let n=new e,r=new e;if(65!=t.O&&69!=t.O&&83!=t.O&&87!=t.O&&84!=t.O&&91!=t.O&&93!=t.O&&95!=t.O&&99!=t.O||(r.l=1,r.s=1,r.o=1),2==t.I?++r.l:1==t.I&&(++r.s,++r.o),!r.p())return n;let c=t.j(308);return n=r.multiply(c),n}static Ze(t){let n=new e,r=new e;if(16==t.O||4==t.O||20==t.O||41==t.O?(r.l=1,r.g=1,r.o=1):89==t.O&&(r.l=1,r.g=2,r.o=2),!r.p())return n;let c=t.j(304);return n=r.multiply(c),n}static oe(t){let n=new e;return"そうりゅう"==t.D?n.l=4:"ひりゅう"==t.D&&(n.l=1),n}static ae(t){let n=new e,r=new e;if(553==t.q)r.l=4;else{if(554!=t.q)return 196==t.q?(n.l=3,n):197==t.q?(n.l=6,n):n;r.l=4}let c=t.j(100);return n=r.multiply(c),n}static W(t){let n=new e,r=new e;if(553==t.q)r.l=2;else{if(554!=t.q)return n;r.l=2}let c=t.j(24)+t.j(57)+t.j(111);return n=r.multiply(c),n}static te(t){let n=new e;if(553==t.q)n.l=3,n.o=2,n.i=1,n.P=5,n.h=1;else if(554==t.q)n.l=3,n.o=3,n.i=3,n.P=5,n.h=1;else if(196==t.q)n.P=5,n.h=1;else{if(197!=t.q)return n;n.P=5,n.h=1}return n}static ie(t){let n=new e;return"そうりゅう"==t.D?n.l=1:"ひりゅう"==t.D&&(n.l=3),n}static fe(t){let n=new e;if(196==t.q)n.l=7;else{if(197!=t.q)return n;n.l=3}return n}static Se(t){let n=new e;return"あかぎ"==t.D?n.l=3:"かが"==t.D||"しょうかく"==t.D?n.l=2:("ずいかく"==t.D||"りゅうじょう"==t.D)&&(n.l=1),n}static Fe(t){let n=new e;return"あかぎ"==t.D?n.l=3:"かが"==t.D?n.l=2:"しょうかく"==t.D?(n.l=2,461!=t.q&&466!=t.q||(n.l+=2)):"ずいかく"==t.D?(n.l=1,462!=t.q&&467!=t.q||++n.l):"りゅうじょう"==t.D&&(n.l=1),n}static ot(t){let n=new e,r=new e;if(553==t.q)r.l=2;else if(554==t.q)r.l=4;else if(196==t.q)r.l=3;else if(197==t.q)r.l=3;else if(508==t.q)r.l=4;else{if(509!=t.q)return n;r.l=4}let c=t.j(320);return n=r.multiply(c),n}static Ge(t){let n=0,r=new e,c=new e,l=0;if(66==t.O||28==t.O)c.l=2,c.s=1,c.o=3,l=1;else{if(74!=t.O&&77!=t.O)return r;c.l=1,c.s=1,c.o=2,l=2}let u=t.j(293);r=c.multiply(u);let s=0;for(let e of t.k){let t=e;n=t.m,(12==n||13==n)&&t.Nt>=5&&++s}let i=t.j(174);return 1==l?(s>0&&(r.l+=2,r.o+=3,++r.u),1==i?(r.l+=2,r.u+=4):i>=2&&(r.l+=3,r.u+=7)):2==l&&s>0&&(r.l+=2,r.o+=3,++r.g),r}static He(t){let n=0,r=new e,c=new e;if(12!=t.O&&1!=t.O&&5!=t.O)return r;c.l=1;let l=t.j(294);r=c.multiply(l);let u=0;for(let e of t.k){let t=e;n=t.m,(12==n||13==n)&&t.Nt>=5&&++u}let s=t.j(13),i=t.j(125),f=t.j(285),o=s+i+f;return u>0&&(r.l+=3,r.o+=2,++r.u),1==o?(++r.l,r.u+=3):o>=2&&(r.l+=2,r.u+=5),f>=1&&++r.u,r}static Je(t){let n=0,r=new e,c=new e;if(12!=t.O&&1!=t.O&&5!=t.O)return r;c.l=2,c.s=2;let l=t.j(295);r=c.multiply(l);let u=0,s=0;for(let e of t.k){let t=e;n=t.m,12!=n&&13!=n||(t.Nt>=5&&++u,t.Xt>=2&&++s)}let i=t.j(13),f=t.j(125),o=t.j(285),a=i+f+o;return u>0&&(r.l+=3,r.o+=2,++r.u),1==a?(++r.l,r.u+=3):a>=2&&(r.l+=2,r.u+=5),o>=1&&++r.u,s>0&&(r.s+=6),r}static Qe(t){let n=new e,r=new e;if(12==t.O)r.o=2;else{if(1!=t.O&&5!=t.O)return n;r.o=1}let c=t.j(297);return n=r.multiply(c),n}static re(t){let n=new e,r=new e;1!=t.O&&5!=t.O&&10!=t.O||++r.s,"ゆうだち"==t.D&&(++r.l,++r.s,r.o+=2),145==t.q?++r.l:144==t.q?++r.u:469==t.q?r.o+=2:242==t.q||497==t.q||244==t.q||498==t.q?++r.o:627==t.q&&++r.l;let c=!0;if(r.p()||(c=!1),0==c)return n;let l=t.j(63);return n=r.multiply(l),n}static Ke(t){let n=0,r=new e,c=new e;1!=t.O&&5!=t.O&&10!=t.O&&23!=t.O||++c.l,10!=t.O&&23!=t.O||++c.o,145==t.q?(++c.l,++c.s):144==t.q?(++c.l,++c.u):469==t.q||587==t.q||242==t.q?++c.o:497==t.q?(++c.l,++c.o):244==t.q?++c.o:498==t.q?(++c.s,++c.o):627==t.q&&(c.l+=2,++c.u);let l=!0;if(c.p()||(l=!1),0==l)return r;let u=t.j(296);r=c.multiply(u);let s=0;if(1!=t.O&&5!=t.O&&10!=t.O||(s=1),23==t.O&&(s=2),0==s)return r;let i=0,f=0;for(let e of t.k){let t=e;n=t.m,12!=n&&13!=n||(t.Nt>=5&&++i,t.Xt>=2&&++f)}return i>0&&(1==s?(++r.l,r.o+=2,r.u+=2):2==s&&(++r.l,r.o+=2,r.u+=3)),t.j(285)+t.j(125)>=1&&1==s&&(++r.l,r.u+=3),t.j(15)+t.j(286)>=1&&2==s&&(++r.l,r.u+=3),f>0&&(1==s?r.s+=5:2==s&&(r.s+=6)),r}static se(t){let n=0,r=0,c=new e,l=new e;142==t.q?(l.l+=2,++l.o):295==t.q||416==t.q||417==t.q?++l.l:264==t.q&&(++l.l,++l.s),7!=t.O&&13!=t.O&&8!=t.O&&29!=t.O&&9!=t.O&&31!=t.O||++l.l,l.p()&&(n=t.j(90),c=l.multiply(n));let u=[];if("あおば"==t.D&&(u[1]=1),13!=t.O&&7!=t.O||(u[2]=1),0==u.length)return c;let s=0,i=0;for(let e of t.k){let t=e;r=t.m,12!=r&&13!=r||(t.Nt>=5&&++s,t.Xt>=2&&++i)}return i>0&&null!=u[1]&&(c.s+=5,c.o+=2),s>0&&null!=u[2]&&(c.l+=3,c.o+=2,c.u+=2),c}static $(t){let n=0,r=0,c=new e,l=!1,u=new e;7!=t.O&&13!=t.O&&8!=t.O&&29!=t.O&&9!=t.O&&31!=t.O||(++u.l,l=!0),8!=t.O&&29!=t.O&&9!=t.O&&31!=t.O||(++u.l,++u.o,l=!0);let s=t.j(50);if(9!=t.O&&31!=t.O||s>=2&&(++u.l,l=!0),0==l)return c;c=u.multiply(s);let i=0;for(let e of t.k){let t=e;n=t.m,(12==n||13==n)&&t.Nt>=5&&++i}return i>0&&(7==t.O||13==t.O?(r=t.j(90),0==r&&(++c.l,++c.o,++c.u)):8!=t.O&&29!=t.O&&9!=t.O&&31!=t.O||(c.l+=3,c.o+=2,c.u+=2)),c}static Ue(t){let n=new e,r=new e;67==t.O||78==t.O||82==t.O||88==t.O?(r.l+=2,++r.i,67==t.O&&(r.o-=2)):149!=t.q&&150!=t.q&&151!=t.q&&152!=t.q||(++r.l,++r.i,r.o-=3);let c=!0;if(r.p()||(c=!1),0==c)return n;let l=t.j(298)+t.j(299)+t.j(300);return n=r.multiply(l),n}static Ve(t){let n=new e,r=new e;67!=t.O&&78!=t.O&&82!=t.O&&88!=t.O||(r.s+=2,++r.o,++r.i);let c=!0;if(r.p()||(c=!1),0==c)return n;let l=t.j(301);return n=r.multiply(l),n}static nt(t){var n;let r=0,c=0,l=0,u=new e,s=new e;34==t.O?(s.l+=2,++s.s,++s.o):56==t.O?(s.l+=2,++s.o):90==t.O&&(s.l+=3,s.u+=2,++s.s,++s.o);let i=new e,f=new e;622!=t.q&&623!=t.q&&624!=t.q||(s.l+=2,++s.o,++s.g,i.l=1,i.u=1,f.l=3,f.o=2,f.u=2);let o=!0;if(s.p()||(o=!1),0==o)return u;let a=t.j(310);if(u=s.multiply(a),i.p()){r=0;for(let e of null!==(n=t.T[310])&&void 0!==n?n:[]){e.level>=7&&r++}r>0&&u.add(i.multiply(r))}if(f.p()){c=0;for(let e of t.k){let t=e;l=t.m,(12==l||13==l)&&t.Nt>=5&&++c}c>0&&u.add(f)}return u}static we(t){let n=new e,r=new e;34==t.O||56==t.O?++r.l:90==t.O&&(r.l+=2,++r.u);let c=!0;if(r.p()||(c=!1),0==c)return n;let l=t.j(119);return n=r.multiply(l),n}static rt(t){let n=new e,r=new e;87!=t.O&&91!=t.O||(r.l+=2,r.s+=2,++r.o,++r.i);let c=!0;if(r.p()||(c=!1),0==c)return n;let l=t.j(313);return n=r.multiply(l),n}static ct(t){let n=new e,r=new e;87!=t.O&&91!=t.O||(++r.l,r.u+=3);let c=!0;if(r.p()||(c=!1),0==c)return n;let l=t.j(314);return n=r.multiply(l),n}static lt(t){let n=new e,r=new e;65!=t.O&&69!=t.O&&83!=t.O&&87!=t.O&&84!=t.O&&91!=t.O&&93!=t.O&&95!=t.O&&99!=t.O||(r.l+=2,r.o+=3,r.S+=4),87!=t.O&&91!=t.O||(++r.l,n.h=1);let c=!0;if(r.p()||(c=!1),0==c)return n;let l=t.j(315);return n.add(r.multiply(l)),n}static Dt(t){let n=new e,r=new e;if(65!=t.O&&69!=t.O&&83!=t.O&&87!=t.O&&84!=t.O&&91!=t.O&&93!=t.O&&95!=t.O&&99!=t.O&&67!=t.O&&78!=t.O&&82!=t.O&&88!=t.O)return n;++r.l,++r.o,++r.s,95==t.O&&(++r.l,r.o+=2,r.s+=2);let c=t.j(358);return n=r.multiply(c),n}static be(t){let n=new e,r=!1,c=!1;147!=t.q&&73!=t.O&&81!=t.O||(r=!0),"ゆうばり"==t.D&&(c=!0);let l=new e;if((r||c)&&(l.l+=2,++l.i),!l.p())return n;let u=t.j(282);return n=l.multiply(u),n}static qe(t){let n=new e,r=!1;147!=t.q&&73!=t.O&&81!=t.O||(r=!0);let c=new e;if(r&&(c.u+=3,++c.l,++c.i),!c.p())return n;let l=t.j(283);return n=c.multiply(l),n}static Z(t){let n=new e,r=new e;if(["あさしも","はるかぜ","かみかぜ","やまかぜ","まいかぜ","しぐれ"].indexOf(t.D)>=0?(r.g+=3,r.o+=2,++r.l):["きしなみ","いそかぜ","はまかぜ","うしお","いかづち","やまぐも"].indexOf(t.D)>=0&&(r.g+=2,r.o+=2),!r.p())return n;let c=t.j(47);return n=r.multiply(c),n}static Ee(t){let n=new e,r=new e;if([407,419,145,151,541].indexOf(t.q)>=0?(++r.l,r.s+=2,++r.i,r.o+=3):["おおよど","ひびき","かしま"].indexOf(t.D)>=0?(++r.s,++r.i,r.o+=3):["やはぎ","ゆきかぜ","いそかぜ","あさしも","はまかぜ","かすみ","すずつき"].indexOf(t.D)>=0&&(r.s+=2,++r.i,r.o+=2),!r.p())return n;let c=t.j(106);return n=r.multiply(c),n}static ge(t){let n=new e,r=!1,c=new e;if([66,28,12,1,5,10,23,18,30,38,22,54].indexOf(t.O)>=0?(c.l=1,c.u=2,c.o=2,c.g=2,c.S=1,r=!0):[21,4,20,16,34,56,41,52].indexOf(t.O)>=0?(c.l=1,c.u=2,c.o=2,c.S=3,r=!0):[7,13,29,8,9,31].indexOf(t.O)>=0&&(c.l=1,c.o=2,c.S=3,r=!0),0==r)return n;let l=t.j(129);return n=c.multiply(l),n}static he(t){let n=new e,r=new e;if(68==t.O&&(++r.l,r.s+=2,r.o+=3),!r.p())return n;let c=t.j(184);return n=r.multiply(c),n}static pe(t){let n=new e,r=new e;if(68==t.O&&(r.l+=3,++r.s,++r.o),!r.p())return n;let c=t.j(188);return n=r.multiply(c),n}static ve(t){let n=new e,r=new e;if(68!=t.O&&63!=t.O||(++r.s,r.o+=2),!r.p())return n;let c=t.j(189);return n=r.multiply(c),n}static ut(t){let n=new e,r=new e;if(68==t.O&&(r.l+=4,++r.s,++r.o),!r.p())return n;let c=t.j(316);return n=r.multiply(c),n}static _e(t){let n=new e,r=new e;if(70==t.O?(r.l+=3,r.o+=2,r.S+=2):72!=t.O&&62!=t.O||(++r.o,r.S+=2),392==t.q&&(++r.l,r.o+=2,r.S+=2),!r.p())return n;let c=t.j(194);return n=r.multiply(c),n}static X(t){let n=0,r=0,c=new e;if(null=={11:1,18:1,7:1,10:1}[t.I])return c;let l=0;for(let e of t.k){let t=e;n=t.m,9==n&&(r=t.level,l<r&&(l=r))}return l>=2&&++c.S,l>=4&&++c.l,l>=6&&++c.S,l>=10&&(++c.l,++c.S),c}static ne(t){var n;let r=0,c=new e;if(null==t.T[61])return c;let l=0;for(let e of null!==(n=t.T[61])&&void 0!==n?n:[]){r=e.level,l<r&&(l=r)}return 0==l||("そうりゅう"==t.D?(c.l+=3,c.S+=3):"ひりゅう"==t.D&&(c.l+=2,c.S+=2),508!=t.q&&509!=t.q&&560!=t.q||(++c.l,++c.S),l>=8&&197==t.q&&(++c.l,++c.S)),c}static it(t){let n=0,r=new e,c=new e,l=new e,u=new e;if(411==t.q||412==t.q?++c.l:82==t.q?(c.l+=2,c.s+=2,c.o+=2,u.s=2,u.o=3,u.P=1):553==t.q?(c.l+=2,c.s+=2,c.o+=2,c.P+=3,u.s=2,u.o=3,u.P=1,l.o=2,l.i=1):88==t.q?(c.l+=2,c.s+=2,c.o+=2,u.s=2,u.o=3,u.P=1):541==t.q||573==t.q?(c.l+=3,c.s+=2,++c.o,c.P+=2,l.l=2,l.o=2,l.i=1,l.P=1):554==t.q&&(c.l+=3,c.s+=2,c.o+=2,c.P+=3,u.s=2,u.o=3,u.P=1,l.l=1,l.o=2,l.i=1,l.P=1),!c.p())return r;let s=t.j(318);if(r=c.multiply(s),!l.p()&&!u.p())return r;let i=0;for(let e of t.k){let t=e;n=t.m,(12==n||13==n)&&t.Xt>=2&&++i}let f=t.j(290);return u.p()&&i>0&&0==f&&r.add(u),l.p()&&t.j(290)>=1&&r.add(l),r}static St(t){let n=new e,r=new e;if("こんごう"==t.D?(r.l=1,r.o=1,209==t.q||149==t.q?++r.l:591==t.q&&(r.l+=2,++r.u)):"ひえい"==t.D?(r.l=1,r.o=1,210!=t.q&&150!=t.q||++r.l):"はるな"==t.D?(r.l=1,r.o=1,211!=t.q&&151!=t.q||++r.l):"きりしま"==t.D?(r.l=1,r.o=1,212!=t.q&&152!=t.q||++r.l):("ふそう"==t.D||"やましろ"==t.D||"いせ"==t.D||"ひゅうが"==t.D)&&(r.l=1),!r.p())return n;let c=t.j(328);return n=r.multiply(c),n}static Ft(t){let n=new e,r=new e;if("こんごう"==t.D?(r.l=1,r.o=1,209==t.q?++r.l:149==t.q?(r.l+=2,++r.s):591==t.q&&(r.l+=3,++r.s,r.u+=2)):"ひえい"==t.D?(r.l=1,r.o=1,210==t.q?++r.l:150==t.q&&(r.l+=2,++r.s)):"はるな"==t.D?(r.l=1,r.o=1,211==t.q?++r.l:151==t.q&&(r.l+=2,++r.s)):"きりしま"==t.D?(r.l=1,r.o=1,212==t.q?++r.l:152==t.q&&(r.l+=2,++r.s)):("ふそう"==t.D||"やましろ"==t.D||"いせ"==t.D||"ひゅうが"==t.D)&&(r.l=1),!r.p())return n;let c=t.j(329);return n=r.multiply(c),n}static Pt(t){let n=0,r=0,c=0,l=new e;if("コロラド"==t.D)return n=t.j(330),n>0&&(l.l+=1*n),r=t.j(331),r>0&&(l.l+=1*r,1496==t.q&&(l.l+=1*r,l.o+=1*r)),c=t.j(332),c>0&&(l.l+=1*c,1496==t.q&&(l.l+=1*c,l.o+=1*c,l.s+=1*c)),l;let u=new e;if(19==t.O?(u.l=1,(541==t.q||573==t.q)&&++u.l):88==t.O&&(u.l=1,576==t.q&&++u.l),!u.p())return l;let s=t.j(330)+t.j(331)+t.j(332);return l=u.multiply(s),l}static st(t){let n=new e,r=new e;return 6==t.O&&(++r.l,++r.s),149==t.q||591==t.q?(r.l+=2,r.s+=2):150==t.q?(++r.l,++r.s):151==t.q?(++r.l,++r.s,++r.o):152==t.q?(r.l+=2,++r.s):541==t.q?(++r.l,r.s+=2):573==t.q&&(r.l+=2,r.s+=2,++r.o),r.p()?(n=r.multiply(1),n):n}static Y(t){let n=new e,r=new e;return 149==t.q||591==t.q?(++r.l,++r.s):150==t.q?++r.s:151==t.q?(++r.s,++r.o):152==t.q&&++r.l,r.p()?(n=r.multiply(1),n):n}static Et(t){let n=new e,r=new e;if(554==t.q?(r.g=2,r.o=1):553==t.q&&(r.g=1,r.o=1),!r.p())return n;let c=t.j(324)+t.j(325);return n=r.multiply(c),n}static wt(t){let n=new e,r=new e;if(554==t.q?(r.l=1,r.g=3,r.o=2):553==t.q&&(r.g=2,r.o=1),!r.p())return n;let c=t.j(326);return n=r.multiply(c),n}static gt(t){let n=new e,r=new e;if(554==t.q?(r.l=2,r.g=4,r.o=2):553==t.q&&(r.l=1,r.g=3,r.o=1),!r.p())return n;let c=t.j(327);return n=r.multiply(c),n}static at(t){let n=new e,r=new e;if(554!=t.q&&553!=t.q||(r.l=5,r.s=2,r.o=2,r.g=1),!r.p())return n;let c=t.j(322);return n=r.multiply(c),n}static xt(t){let n=new e,r=new e;if(554!=t.q&&553!=t.q||(r.l=6,r.s=3,r.o=3,r.g=2),!r.p())return n;let c=t.j(323);return n=r.multiply(c),n}static ft(t){let n=new e,r=new e;if(554!=t.q&&553!=t.q||(r.l=7,r.s=3,r.o=2),!r.p())return n;let c=t.j(319);return n=r.multiply(c),n}static ht(t){let n=new e,r=new e;if(277==t.q||278==t.q?(r.s=1,r.o=1):594!=t.q&&599!=t.q||(r.s=2,r.o=1),!r.p())return n;let c=t.j(335);return n=r.multiply(c),n}static pt(t){let n=new e,r=new e;if(277==t.q||278==t.q?(r.l=1,r.s=1,r.o=1):594!=t.q&&599!=t.q||(r.l=1,r.s=2,r.o=1),!r.p())return n;let c=t.j(336);return n=r.multiply(c),n}static vt(t){let n=new e,r=new e;if(277==t.q||278==t.q?(r.l=1,r.s=1,r.o=1):594!=t.q&&599!=t.q||(r.l=2,r.s=2,r.o=1),!r.p())return n;let c=t.j(337);return n=r.multiply(c),n}static _t(t){let n=new e,r=new e;if(277==t.q||278==t.q?(r.l=1,r.s=1,r.o=2):594==t.q?(r.l=1,r.s=2,r.o=3):599==t.q&&(r.l=4,r.s=3,r.o=4),!r.p())return n;let c=t.j(338);return n=r.multiply(c),n}static dt(t){let n=new e,r=new e;if(277==t.q||278==t.q?(r.l=1,r.s=2,r.o=2):594==t.q?(r.l=1,r.s=3,r.o=4):599==t.q&&(r.l=6,r.s=4,r.o=5),!r.p())return n;let c=t.j(339);return n=r.multiply(c),n}static U(t){let n=new e,r=new e;if(277==t.q||278==t.q||156==t.q?r.l=1:594==t.q?(r.l=1,r.o=1):599==t.q&&(r.l=2,r.o=1),!r.p())return n;let c=t.j(18)+t.j(52);return n=r.multiply(c),n}static Tt(t){let n=new e,r=new e;if(277==t.q||278==t.q||461==t.q||466==t.q||462==t.q||467==t.q?r.l=1:594==t.q?(r.l=2,r.s=1,r.o=1):599==t.q&&(r.l=3,r.s=2,r.o=2),!r.p())return n;let c=t.j(342);return n=r.multiply(c),n}static At(t){let n=new e,r=new e;if(277==t.q||278==t.q?r.l=2:461==t.q||466==t.q||462==t.q||467==t.q?r.l=1:594==t.q?(r.l=3,r.s=2,r.o=1):599==t.q&&(r.l=5,r.s=3,r.o=3),!r.p())return n;let c=t.j(343);return n=r.multiply(c),n}static Lt(t){let n=new e,r=new e;if(599==t.q?r.l=3:555==t.q||560==t.q?(r.l=2,r.g=2):318==t.q?(r.l=4,r.g=1):282==t.q&&(r.l=2,r.g=1),!r.p())return n;let c=t.j(344);return n=r.multiply(c),n}static bt(t){let n=new e,r=new e;if(599==t.q?(r.l=3,r.o=1):555==t.q||560==t.q?(r.l=3,r.g=2,r.o=2):318==t.q?(r.l=5,r.g=1,r.o=2):282==t.q&&(r.l=3,r.g=1,r.o=1),!r.p())return n;let c=t.j(345);return n=r.multiply(c),n}static yt(t){let n=new e,r=new e;if("ガリバルディ"!=t.D&&"アブルッツィ"!=t.D||(r.l=1,r.s=1,r.o=1),!r.p())return n;let c=t.j(340);return n=r.multiply(c),n}static kt(t){let n=new e,r=new e;if("ガリバルディ"==t.D||"アブルッツィ"==t.D?(r.l=2,r.s=1,r.o=1):"ゴトランド"==t.D&&(r.l=1,r.s=1,r.o=1),!r.p())return n;let c=t.j(341);return n=r.multiply(c),n}static V(t){let n=new e,r=new e;if("ほうしょう"==t.D&&(r.l=2,r.o=2,r.g=2,r.s=2),75!=t.O&&76!=t.O||(r.l=2,r.g=3),7==t.I&&(++r.s,++r.o),!r.p())return n;let c=t.j(19);return n=r.multiply(c),n}static de(t){let n=new e,r=new e;if("ほうしょう"==t.D&&(r.l=3,r.o=4,r.g=4,r.s=3),75!=t.O&&76!=t.O||(r.l=2,r.g=5,r.s=1,r.o=1),7==t.I&&(r.g+=2,++r.s,++r.o),!r.p())return n;let c=t.j(228);return n=r.multiply(c),n}static Ct(t){let n=new e,r=!1,c=new e;if("ゴトランド"==t.D&&(c.l=4,c.g=3,c.o=2,c.S=3,r=!0),70==t.O?(c.l=2,c.g=3,c.o=1,c.S=2,r=!0):72==t.O||62==t.O?(++c.l,c.g+=2,++c.o,c.S+=2,r=!0):67!=t.O&&78!=t.O&&82!=t.O&&88!=t.O||(c.l+=2,c.g+=2,c.o+=2,c.S+=2,r=!0),0==r)return n;let l=t.j(368);return n=c.multiply(l),n}static Bt(t){let n=new e,r=!1,c=new e;if("ゴトランド"==t.D&&(c.l+=2,++c.g,++c.o,++c.S,r=!0),70==t.O?(++c.l,++c.g,++c.o,++c.S,r=!0):72==t.O||62==t.O?(++c.l,++c.o,++c.S,r=!0):67!=t.O&&78!=t.O&&82!=t.O&&88!=t.O||(c.l+=2,c.o+=2,c.S+=2,r=!0),0==r)return n;let l=t.j(367);return n=c.multiply(l),n}static qt(t){let n=new e,r=new e;if(95==t.O?r.l=2:9==t.O&&(r.l=1),!r.p())return n;let c=t.j(356)+t.j(357);return n=r.multiply(c),n}static It(t){let n=new e,r=new e;if("パース"==t.D?(r.l=2,r.s=2,r.o=1):"ゆうばり"==t.D&&(r.l=1,r.s=1,r.o=1),622!=t.q&&623!=t.q&&624!=t.q||(++r.l,++r.s),!r.p())return n;let c=t.j(359);return n=r.multiply(c),n}static Ot(t){let n=new e,r=new e;if("デ・ロイテル"==t.D?(r.l=2,r.s=2,r.o=1):"ゴトランド"==t.D&&(r.l=2,r.s=1,r.o=1),41==t.O&&(r.l=1,r.s=1),!r.p())return n;let c=t.j(360)+t.j(361);return n=r.multiply(c),n}static jt(t){let n=new e,r=new e,c=!1;if(99==t.O?(r.l=1,r.s=2,r.o=1,c=!0):34==t.O||21==t.O?(r.l=-3,r.s=-3,r.o=-8,c=!0):4==t.O||20==t.O||16==t.O?(r.l=-3,r.s=-2,r.o=-6,c=!0):89==t.O||56==t.O?(r.l=-2,r.s=-1,r.o=-4,c=!0):52!=t.O&&41!=t.O&&98!=t.O||(r.s=-1,r.o=-2,c=!0),65!=t.O&&69!=t.O&&83!=t.O&&87!=t.O&&84!=t.O&&91!=t.O&&93!=t.O&&95!=t.O&&99!=t.O||(++r.s,++r.o,c=!0),0==c)return n;let l=t.j(362)+t.j(363);return n=r.multiply(l),n}static Mt(t){let n=new e,r=new e;623==t.q||586==t.q||119==t.q||118==t.q?(r.u=1,r.o=-2,119==t.q?++r.u:623==t.q&&(++r.l,r.u+=3)):(r.l=-1,r.o=-7);let c=t.j(364);return n=r.multiply(c),n}static Xe(t){let n=new e,r=new e,c=!1;if(488!=t.q&&141!=t.q&&160!=t.q&&624!=t.q||(r.g=1,r.o=1,c=!0),0==c)return n;let l=t.j(287);return n=r.multiply(l),n}static ze(t){let n=new e,r=new e,c=!1;if(488==t.q||141==t.q||160==t.q?(r.g=2,r.o=1,c=!0):624==t.q&&(r.l=1,r.g=3,r.o=2,c=!0),0==c)return n;let l=t.j(288);return n=r.multiply(l),n}static Pe(t){let n=new e,r=new e,c=!1;return 488==t.q||141==t.q||160==t.q||622==t.q||623==t.q?(r.g=1,r.o=3,c=!0):624==t.q&&(r.g=3,r.o=5,c=!0),54==t.O&&(r.g=1,r.o=2,c=!0),0==c||(n=r.multiply(1)),n}static Rt(t){let n=new e,r=new e,c=!1;if(37!=t.O&&19!=t.O&&2!=t.O&&26!=t.O&&6!=t.O||(++r.l,c=!0),136!=t.q&&148!=t.q&&546!=t.q&&541!=t.q&&573!=t.q||(++r.l,c=!0),591==t.q&&(r.l+=2,c=!0),0==c)return n;return n=r.multiply(1),n}}class c{constructor(e){this.zt=e}get _(){return this.zt.gearId}get Gt(){return 0}get Ht(){return this.zt.name}get level(){return this.zt.star}Jt(){return!1}get Kt(){return this.zt.proficiency.level}get Qt(){return 0}get m(){return this.zt.categoryId}get Ut(){return 128==this._?38:142==this._?43:281==this._?38:this.m}get Vt(){return 0}get Wt(){return this.zt.iconId}get Yt(){return this.zt.range}get Zt(){return this.zt.firepower}get $t(){return this.zt.torpedo}get Xt(){return this.zt.antiAir}get en(){return this.zt.asw}get tn(){return this.zt.bombing}get nn(){return this.zt.accuracy}get rn(){return this.zt.evasion}get Nt(){return this.zt.los}get cn(){return this.zt.armor}ln(){return this.zt.radius}}exports.createEquipmentBonus=e=>{const t=e.gears.map(e=>e&&new c(e)).filter(e=>Boolean(e)),n=r.B(e,t);return{firepower:n.l,torpedo:n.u,antiAir:n.s,armor:n.i,evasion:n.o,asw:n.g,los:n.S,accuracy:n.P,range:n.h}};