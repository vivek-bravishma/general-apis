import express from "express";
import cors from "cors";
import axios from "axios";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import { JSDOM } from "jsdom";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(3010, () => console.log("server running"));

app.get("/test", async (req, res) => {});

async function fetchTags() {
	try {
		const { data: tags } = await axios.get(
			"https://www.qatarairways.com/qr/qrweb/km/fetchTags.json"
		);
		let tagsInfoList = tags.tagsInfoList;
		let subTagsInfoList = [];

		tagsInfoList.forEach((tagInfo) => {
			let subTagsInfoListArr = tagInfo.subTagsInfoList;
			subTagsInfoListArr.forEach(
				(ele) => (subTagsInfoList = [...subTagsInfoList, ele])
			);
		});

		console.log("tags=> ", subTagsInfoList);

		await fs.writeFile(
			"./files/tags.json",
			JSON.stringify(subTagsInfoList),
			(err) => {
				if (err) {
					console.log("err=> ", err);
					throw err;
				}
				console.log("tags.json saved");
			}
		);

		res.send("sup");
	} catch (error) {
		console.log("get fac tags failed ");
	}
}

// fetchTags();

async function getFaqs(faqTag) {
	try {
		const faqTagCust = {
			"faq-tag-id": faqTag["@id"],
			"faq-tag-name": faqTag["vkm:name"],
			"faq-tag-coverage": faqTag["vkm:coverage"],
		};
		const { data } = await axios.get(
			`https://www.qatarairways.com/qr/qrweb/km/fetchFaqs.${faqTag["vkm:coverage"]}.json`
		);
		let res = data.map((ele) => {
			return { ...ele, ...faqTagCust };
		});
		console.log(res);

		await fs.writeFile("./files/faks.json", JSON.stringify(res), (err) => {
			if (err) {
				console.log("err=> ", err);
				throw err;
			}
			console.log("faks.json saved");
		});
		return res;
	} catch (error) {
		console.log("get facs failed for==> ", faqTag);
	}
}

// getFaqs({
// 	"@id": "/km-tag-service/default/tag/topic_checkingin",
// 	"vkm:name": "Checking In",
// 	"vkm:coverage":
// 		"selection-default-tags-topic-topic_airportservices-topic_checkingin",
// });

async function getFaqArt(faq) {
	try {
		const { data } = await axios.get(
			`https://www.qatarairways.com/qr/qrweb/km/fetchFaqArticle.${faq?.articleId}.v${faq?.articleVersion}.json`
		);

		await fs.writeFile(
			"./files/fakArt.json",
			JSON.stringify({ ...data, ...faq }),
			(err) => {
				if (err) {
					console.log("err=> ", err);
					throw err;
				}
				console.log("faks.json saved");
			}
		);
		console.log("{ ...data, ...faq }==> ", { ...data, ...faq });
		return { ...data, ...faq };
	} catch (error) {
		console.log("get fac failed for==> ", faq);
	}
}

getFaqArt({
	articleId: "1Buwp1sBQD77q9Ue5TBmm6",
	articleVersion: 2,
	"vkm:name": "Who can use online check-in?",
});

function getTextFromHTML(html) {
	const dom = new JSDOM(html);

	const links = dom.window.document.querySelectorAll("a");
	links.forEach((link) => {
		const url = link.getAttribute("href");
		link.textContent = url;
	});

	return dom.window.document.body.textContent;
}
// const html = `
//   <p style=\"margin: 0.0cm 0.0cm 1.0E-4pt;text-align: justify;background: white;font-size: 12.0pt;font-family: &quot;Times New Roman&quot; , serif;\" data-mce-style=\"margin: 0cm 0cm 0.0001pt; text-align: justify; background: white; font-size: 12pt; font-family: 'Times New Roman', serif;\"><span style=\"font-size: 10.0pt;font-family: arial , helvetica , sans-serif;color: black;\" data-mce-style=\"font-size: 10pt; font-family: arial, helvetica, sans-serif; color: black;\"><span id=\"_mce_caret\" data-mce-bogus=\"1\"><span style=\"font-family: arial , helvetica , sans-serif;font-size: 10.0pt;color: rgb(0,0,0);\" data-mce-style=\"font-family: arial, helvetica, sans-serif; font-size: 10pt; color: #000000;\">Online check-in for flights from the U.S. opens 24 hours prior to departure. For flights to the U.S., the online check-in window opens 24 hours prior to departure from Doha. </span></span></span></p><p style=\"margin: 0.0cm 0.0cm 1.0E-4pt;text-align: justify;background: white;font-size: 12.0pt;font-family: &quot;Times New Roman&quot; , serif;\" data-mce-style=\"margin: 0cm 0cm 0.0001pt; text-align: justify; background: white; font-size: 12pt; font-family: 'Times New Roman', serif;\"><span style=\"font-size: 10.0pt;font-family: arial , helvetica , sans-serif;color: black;\" data-mce-style=\"font-size: 10pt; font-family: arial, helvetica, sans-serif; color: black;\"><br data-mce-bogus=\"1\"></span></p><p style=\"margin: 0.0cm 0.0cm 1.0E-4pt;text-align: justify;background: white;font-size: 12.0pt;font-family: &quot;Times New Roman&quot; , serif;\" data-mce-style=\"margin: 0cm 0cm 0.0001pt; text-align: justify; background: white; font-size: 12pt; font-family: 'Times New Roman', serif;\"><span style=\"font-size: 10.0pt;font-family: arial , helvetica , sans-serif;color: black;\" data-mce-style=\"font-size: 10pt; font-family: arial, helvetica, sans-serif; color: black;\"><span style=\"font-family: arial , helvetica , sans-serif;font-size: 10.0pt;color: rgb(0,0,0);\" data-mce-style=\"font-family: arial, helvetica, sans-serif; font-size: 10pt; color: #000000;\">For all other flights, online check-in is available 48 hours to 90 minutes prior to the flight's departure. Additionally, the 48 hours to the 90-minute window should include your connecting flights. </span></span></p><p style=\"margin: 0.0cm 0.0cm 1.0E-4pt;text-align: justify;background: white;font-size: 12.0pt;font-family: &quot;Times New Roman&quot; , serif;\" data-mce-style=\"margin: 0cm 0cm 0.0001pt; text-align: justify; background: white; font-size: 12pt; font-family: 'Times New Roman', serif;\"><span style=\"font-size: 10.0pt;font-family: arial , helvetica , sans-serif;color: black;\" data-mce-style=\"font-size: 10pt; font-family: arial, helvetica, sans-serif; color: black;\">&nbsp;</span></p><p style=\"margin: 0.0cm 0.0cm 1.0E-4pt;text-align: justify;background: white;font-size: 12.0pt;font-family: &quot;Times New Roman&quot; , serif;\" data-mce-style=\"margin: 0cm 0cm 0.0001pt; text-align: justify; background: white; font-size: 12pt; font-family: 'Times New Roman', serif;\"><span style=\"font-family: arial , helvetica , sans-serif;font-size: 10.0pt;\" data-mce-style=\"font-family: arial, helvetica, sans-serif; font-size: 10pt;\"><span style=\"color: black;\" data-mce-style=\"color: black;\">For more information on online check-in, please&nbsp;</span><a style=\"color: rgb(5,99,193);text-decoration: underline;\" href=\"http://www.qatarairways.com/global/en/checking-in.page\" data-mce-href=\"http://www.qatarairways.com/global/en/checking-in.page\" data-mce-style=\"color: #0563c1; text-decoration: underline;\" target=\"_blank\"><span style=\"color: rgb(21,142,194);\" data-mce-style=\"color: #158ec2;\">click here</span></a><span style=\"color: rgb(85,85,85);\" data-mce-style=\"color: #555555;\">.</span></span></p>
// `;

// const text = getTextFromHTML(html);

// console.log(text);
