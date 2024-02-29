import axios from "axios";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import { JSDOM } from "jsdom";
import pdf from "pdfkit";
import * as cheerio from "cheerio";

const scraphtml = async () => {
	var options = {
		method: "GET",
		url: "https://www.qatarairways.com/en/baggage/allowance.html",
		headers: {
			"User-Agent":
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0",
			Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
			"Accept-Language": "en-US,en;q=0.5",
			"Accept-Encoding": "gzip, deflate, br",
			Connection: "keep-alive",
		},
	};

	axios
		.request(options)
		.then(function (response) {
			const dom = new JSDOM(response.data);
			const main = dom.window.document.getElementById("main");
			// const links = dom.window.document.querySelectorAll("a");
			const links = main.querySelectorAll("a");
			links.forEach((link) => {
				const url = link.getAttribute("href");
				link.textContent = ` ${url} `;
				// console.log('link==> ',link.textContent)
			});
			const scripts = main.querySelectorAll("script");
			scripts.forEach((script) => {
				main.remove(script);
			});
			console.log("fter==============> ", main.innerHTML);
		})
		// .then(function (response) {
		// 	// console.log(response.data);
		// 	// const dom = new JSDOM(response.data);
		// 	// fs.writeFileSync("./html/allowance.html", response.data);
		// 	const dom = new JSDOM(response.data);
		// 	// const main = dom.window.document.getElementById("main").innerHTML;
		// 	const main = dom.window.document.getElementById("main");

		// 	// const links = dom.window.document.querySelectorAll("a");
		// 	const links = main.querySelectorAll("a");
		// 	links.forEach((link) => {
		// 		const url = link.getAttribute("href");
		// 		link.textContent = ` ${url} `;
		// 		// console.log('link==> ',link.textContent)
		// 	});

		// 	const scripts = main.querySelectorAll("script");
		// 	scripts.forEach((script) => {
		// 		main.remove(script);
		// 	});

		// 	console.log("fter==============> ", main.innerHTML);
		// })
		.catch(function (error) {
			console.error(error);
		});
	fs.readFile("./html/allowance.html", "utf-8", (err, data) => {
		if (err) console.log("err==> ", err);
		if (data) {
			const dom = new JSDOM(JSON.stringify(data));
			const main =
				dom.window.document.getElementsByTagName("main")[0].innerHTML;
			console.log(JSON.stringify(main));
			return;
		}
		return;
	});

	return "sup";
};

const test = async () => {
	// const tempHT = "<ul id='fruits'><style>.fu{}</style><script>let fu;</script><li class='apple'>Apple</li><script>let fua;</script><li class='orange'>Orange</li><li class='orange'>Vegie<li class='orange'>tamata<li class='orange'>cherry tamata </li><li class='orange'>normal tamata</li></li><li class='orange'>batata</li></li><script>let fuf;</script><li class='orange'>mangoo<script>let fuf;</script><style>.fu{}</style></li><li class='pear'>Pear</li><style>.fu{}</style></ul>";

	let tempHT =
		'<div class="tabbed-content section"><script>$(document).ready(function(){$(window).width()<767&&$(".content-container-list .slick-track").find("li").removeClass("fade")})</script><section class="C8 container is-base-container tabs-before-login"><div class="row"><div class="col-xs-12"><div class="row tab-container"><div class="d-none hide"><div class="select-box"><div class="option-container"><div class="option"><input type="radio" class="radio-partnerhub" id="#poi-tab-21XQB" name="21XQB"><label for="discover" id="partnerhub_0">Economy Class</label></div><div class="option"><input type="radio" class="radio-partnerhub" id="#poi-tab-MML5T" name="MML5T"><label for="discover" id="partnerhub_1">Business Class</label></div><div class="option"><input type="radio" class="radio-partnerhub" id="#poi-tab-EPSES" name="EPSES"><label for="discover" id="partnerhub_2">First Class</label></div></div><div class="selected">Discover</div></div></div><div class=""><div class="tab-menu-block"><label for="f401" class="text-hide">lable</label><nav class="tab-menu"><ul class="tab-menu-list" id="j-poi-tabs"><li class="tab-menu-item active"><a class="tabmenu-link" tab-id="tab-item-1" href="#poi-tab-21XQB" style="outline:0"><span>Economy Class</span></a></li><li class="tab-menu-item"><a class="tabmenu-link" tab-id="tab-item-2" href="#poi-tab-MML5T" style="outline:0"><span>Business Class</span></a></li><li class="tab-menu-item"><a class="tabmenu-link" tab-id="tab-item-3" href="#poi-tab-EPSES" style="outline:0"><span>First Class</span></a></li></ul><div class="select-bar" style="width:297px"></div></nav></div></div></div><div class="row content-container"><div class="col-xs-12"><ul class="content-container-list clearfix offer-tabs-list" id="j-poi-tab-content"><li id="poi-tab-21XQB" class="fade active in"><div class="slide-content-container tab-item-1"><div class="container"><div class="row d-flex d-md-none header_content"><div class="col"><div class="convert_mobile_btn"><div class="d-flex d-flex justify-content-between align-items-center"></div><span class="icon-ic_nav_chevron-down d-inline-block"></span></div></div></div></div><div class="card_detail_content"><div class="table section"><div class="tableComp tableContainer" id="table-module-21XQB-table_copy"><div class="C6_1 row" id="table"><div class="col-xs-12 col-sm-12"><table><tbody><tr><td data-th="Economy Lite">&nbsp;</td><th class="qatar_table_burgundy">Economy Lite</th><th style="text-align:center" class="qatar_table_burgundy">Economy Classic</th><th style="text-align:center" class="qatar_table_burgundy">Economy Convenience</th><th style="text-align:center" class="qatar_table_burgundy">Economy Comfort</th></tr><tr><th class="qatar_table_burgundy">Flights to/from all destinations</th><td style="" data-th="Economy Lite">20kg (44lb)<br></td><td style="" data-th="Economy Classic">25kg (55lb)</td><td style="" data-th="Economy Convenience">30kg (66lb)</td><td style="" data-th="Economy Comfort">35kg (77lb)</td></tr><tr><th class="qatar_table_burgundy">Flights to/from Africa or Americas</th><td style="" data-th="Economy Lite">1 piece<br>(23kg/50lb each)</td><td style="" data-th="Economy Classic">2 pieces (23kg/50lb each)</td><td style="" data-th="Economy Convenience">2 pieces (23kg/50lb each)</td><td style="" data-th="Economy Comfort">2 pieces (23kg/50lb each)</td></tr><tr><th class="qatar_table_burgundy">Hand baggage</th><td style="" data-th="Economy Lite">1 piece (7kg/15lb)<br></td><td style="" data-th="Economy Classic">1 piece (7kg/15lb)</td><td style="" data-th="Economy Convenience">1 piece&nbsp;(7kg/15lb)</td><td style="" data-th="Economy Comfort">1 piece&nbsp;(7kg/15lb)</td></tr></tbody></table></div></div><script>$(document).ready(function(){var n="#table-module-21XQB-table_copy .C6_1",a=[];$(n).find("table").removeAttr("cellspacing cellpadding border width"),$(n).find("table th").each(function(){a.push($(this).text())}),$(window).width()<767&&($(n).find("table tr").each(function(i){$(this);$(this).find("td").each(function(t){null!=$(this).attr("rowspan")&&$(n).find("table tr").eq(i+1).find("td").eq(t).before("<td>"+$(this).text()+"</td>")})}),$(n).find("th").parent().hide()),$(n).find("tr").each(function(){var t=0,i=$(this).find("td");null!=i&&""!=i&&i.each(function(){"&nbsp;"==a[t]?$(this).attr("data-th",""):$(this).attr("data-th",a[t]),$(window).width()<767&&(null!=$(this).attr("data-th")&&45<$(this).attr("data-th").length?$(this).css("margin-bottom",$(this).attr("data-th").length/2+20+"px"):$(this).css("margin-bottom","0")),t++})}),$(n).find("table").find("td").css("text-align",""),$(n).find("table").find("td").removeAttr("width"),$(n).find("table").find("td").removeAttr("valign")})</script></div></div></div></div></li><li id="poi-tab-MML5T" class="fade"><div class="slide-content-container tab-item-2"><div class="container"><div class="row d-flex d-md-none header_content"><div class="col"><div class="convert_mobile_btn"><div class="d-flex d-flex justify-content-between align-items-center"></div><span class="icon-ic_nav_chevron-down d-inline-block"></span></div></div></div></div><div class="card_detail_content"><div class="table section"><div class="tableComp tableContainer" id="table-module-MML5T-table_copy"><div class="C6_1 row" id="table"><div class="col-xs-12 col-sm-12"><table><tbody><tr><td data-th="Business Lite">&nbsp;</td><th class="qatar_table_burgundy">Business Lite</th><th style="text-align:center" class="qatar_table_burgundy">Business Classic</th><th style="text-align:center" class="qatar_table_burgundy">Business&nbsp;Comfort</th><th style="text-align:center" class="qatar_table_burgundy">Business Elite</th></tr><tr><td class="qatar_table_burgundy" data-th="Business Lite">Flights to/from all destinations</td><td style="" data-th="Business Classic">40kg (88lb)<br></td><td style="" data-th="Business&nbsp;Comfort">40kg (88lb)</td><td style="" data-th="Business Elite">40kg&nbsp;(88lb)</td><td style="">40kg&nbsp;(88lb)</td></tr><tr><td class="qatar_table_burgundy" data-th="Business Lite">Flights to/from Africa or Americas</td><td style="" data-th="Business Classic">2 pieces (32kg/70lb each)<br></td><td style="" data-th="Business&nbsp;Comfort">2 pieces (32kg/70lb each)</td><td style="" data-th="Business Elite">2 pieces (32kg/70lb each)</td><td style="">2 pieces (32kg/70lb&nbsp;each)</td></tr><tr><td class="qatar_table_burgundy" data-th="Business Lite">Hand baggage</td><td style="" data-th="Business Classic">2 pieces (15kg/33lb total)<br></td><td style="" data-th="Business&nbsp;Comfort">2 pieces (15kg/33lb total)</td><td style="" data-th="Business Elite">2 pieces (15kg/33lb total)</td><td style="">2 pieces (15kg/33lb total)</td></tr></tbody></table></div></div><script>$(document).ready(function(){var n="#table-module-MML5T-table_copy .C6_1",a=[];$(n).find("table").removeAttr("cellspacing cellpadding border width"),$(n).find("table th").each(function(){a.push($(this).text())}),$(window).width()<767&&($(n).find("table tr").each(function(i){$(this);$(this).find("td").each(function(t){null!=$(this).attr("rowspan")&&$(n).find("table tr").eq(i+1).find("td").eq(t).before("<td>"+$(this).text()+"</td>")})}),$(n).find("th").parent().hide()),$(n).find("tr").each(function(){var t=0,i=$(this).find("td");null!=i&&""!=i&&i.each(function(){"&nbsp;"==a[t]?$(this).attr("data-th",""):$(this).attr("data-th",a[t]),$(window).width()<767&&(null!=$(this).attr("data-th")&&45<$(this).attr("data-th").length?$(this).css("margin-bottom",$(this).attr("data-th").length/2+20+"px"):$(this).css("margin-bottom","0")),t++})}),$(n).find("table").find("td").css("text-align",""),$(n).find("table").find("td").removeAttr("width"),$(n).find("table").find("td").removeAttr("valign")})</script></div></div></div></div></li><li id="poi-tab-EPSES" class="fade in"><div class="slide-content-container tab-item-3"><div class="container"><div class="row d-flex d-md-none header_content"><div class="col"><div class="convert_mobile_btn"><div class="d-flex d-flex justify-content-between align-items-center"></div><span class="icon-ic_nav_chevron-down d-inline-block"></span></div></div></div></div><div class="card_detail_content"><div class="table section"><div class="tableComp tableContainer" id="table-module-EPSES-table_copy"><div class="C6_1 row" id="table"><div class="col-xs-12 col-sm-12"><table><tbody><tr><td data-th="First Elite">&nbsp;</td><th style="text-align:center" class="qatar_table_burgundy">First Elite</th></tr><tr><th class="qatar_table_burgundy">Flights to/from all destinations</th><td style="" data-th="First Elite">50kg (110lb)</td></tr><tr><th class="qatar_table_burgundy">Flights to/from Africa or Americas</th><td style="" data-th="First Elite">2 pieces (32kg/70lb each)</td></tr><tr><th class="qatar_table_burgundy">Hand baggage</th><td style="" data-th="First Elite">2 pieces (15kg/33lb total)</td></tr></tbody></table></div></div><script>$(document).ready(function(){var n="#table-module-EPSES-table_copy .C6_1",a=[];$(n).find("table").removeAttr("cellspacing cellpadding border width"),$(n).find("table th").each(function(){a.push($(this).text())}),$(window).width()<767&&($(n).find("table tr").each(function(i){$(this);$(this).find("td").each(function(t){null!=$(this).attr("rowspan")&&$(n).find("table tr").eq(i+1).find("td").eq(t).before("<td>"+$(this).text()+"</td>")})}),$(n).find("th").parent().hide()),$(n).find("tr").each(function(){var t=0,i=$(this).find("td");null!=i&&""!=i&&i.each(function(){"&nbsp;"==a[t]?$(this).attr("data-th",""):$(this).attr("data-th",a[t]),$(window).width()<767&&(null!=$(this).attr("data-th")&&45<$(this).attr("data-th").length?$(this).css("margin-bottom",$(this).attr("data-th").length/2+20+"px"):$(this).css("margin-bottom","0")),t++})}),$(n).find("table").find("td").css("text-align",""),$(n).find("table").find("td").removeAttr("width"),$(n).find("table").find("td").removeAttr("valign")})</script></div></div></div></div></li></ul></div></div></div></div></section></div>';

	const $ = cheerio.load(tempHT, null, false);
	const main = $("ul");
	// console.log("before==============> ", main);

	// const scripts = main.removeAttr("class");
	const scriptTags = main.find("script");
	for (let i = 0; i < scriptTags.length; i++) {
		const listItem = scriptTags[i];
		$(listItem).remove();
	}

	const styleTags = main.find("style");
	for (let i = 0; i < styleTags.length; i++) {
		const listItem = styleTags[i];
		$(listItem).remove();
	}
	// console.log("after==============> ", main.html());

	let data = [];

	const otherTags = main.find("table");
	for (let i = 0; i < otherTags.length; i++) {
		const listItem = otherTags[i];
		data.push($(listItem).text());
		$(listItem).remove();
	}
	// console.log("scripts==============> ", scripts.html());
	// console.log("after==============> ", main.html());
	console.log("after==============> ", data);
    console.log("otherTags==============> ", otherTags.length);
};

export { scraphtml, test };
