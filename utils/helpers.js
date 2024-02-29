import axios from "axios";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import { JSDOM } from "jsdom";
import pdf from "pdfkit";

async function fetchTags() {
	try {
		const { data: tags } = await axios.get(
			"https://www.qatarairways.com/qr/qrweb/km/fetchTags.json"
		);
		let tagsInfoList = tags.tagsInfoList;
		let subTagsInfoList = [];
		let tagsArr = [];

		tagsInfoList.forEach((tagInfo) => {
			let tagTopicName = tagInfo["vkm:name"];
			let subTagsInfoListArr = tagInfo.subTagsInfoList;
			let myObj = { [tagTopicName]: subTagsInfoListArr };
			tagsArr.push(myObj);
		});

		// fs.writeFile(
		// 	"./files/tags.json",
		// 	JSON.stringify(tagsArr),
		// 	(err) => {
		// 		if (err) {
		// 			console.log("err=> ", err);
		// 			throw err;
		// 		}
		// 		console.log("tags.json saved");
		// 	}
		// );

		return tagsArr;
	} catch (error) {
		console.log("get fac tags failed ", error);
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
			return {
				articleId: ele.articleId,
				articleVersion: ele.articleVersion,
				"vkm:name": ele["vkm:name"],
			};
		});
		// console.log(res);

		// fs.writeFile("./files/faks.json", JSON.stringify(res), (err) => {
		// 	if (err) {
		// 		console.log("err=> ", err);
		// 		throw err;
		// 	}
		// 	console.log("faks.json saved");
		// });
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

		// const artiHTMl = data["vkm:articleBody"];

		// console.log("artiHTMl==> ", artiHTMl);
		const artiText = getTextFromHTML(data["vkm:articleBody"]);
		// console.log("artiText==> ", artiText);

		const res = {
			faqId: data.faqId,
			"vkm:name": faq["vkm:name"],
			"vkm:articleBody": data["vkm:articleBody"],
			articleText: artiText,
		};

		// console.log(res)

		// fs.writeFile(
		// 	"./files/fakArt.json",
		// 	JSON.stringify(res),
		// 	(err) => {
		// 		if (err) {
		// 			console.log("err=> ", err);
		// 			throw err;
		// 		}
		// 		console.log("fakArt.json saved");
		// 	}
		// );
		// console.log("{ ...data, ...faq }==> ", { ...data, ...faq });
		return res;
	} catch (error) {
		console.log("get fac failed for==> ", faq);
	}
}

// let fu = await getFaqArt({
// 	articleId: "1Buwp1sBQD77q9Ue5TBmm6",
// 	articleVersion: 2,
// 	"vkm:name": "Who can use online check-in?",
// });
// console.log("fu==> ", fu);

function getTextFromHTML(html) {
	const dom = new JSDOM(html);

	const links = dom.window.document.querySelectorAll("a");
	links.forEach((link) => {
		const url = link.getAttribute("href");
		link.textContent = ` ${url} `;
	});

	return dom.window.document.body.textContent;
}

// const html = `<p style='margin: 0.0cm 0.0cm 1.0E-4pt;font-size: 11.0pt;'><span style='font-size: 10.0pt;color: rgb(0,0,0);'>Passengers travelling on a group fare will need to check-in at the airport.</span></p>`

// const text = getTextFromHTML(html);

// console.log(text);

/////////////////////////////////////

async function getArti() {
	try {
		let faqs = {}; // this will be our nested object

		let tags = await fetchTags();

		console.log("starting");

		for (let tag of tags) {
			let [category, subcats] = Object.entries(tag)[0];

			faqs[category] = {}; // add new category

			for (let subcat of subcats) {
				try {
					let articles = await getFaqs(subcat);

					faqs[category][subcat["vkm:name"]] = {
						// subcat,
						articles,
					};
				} catch (error) {
					console.log("someThing went wrong in get Faqs=> ", error);
				}
			}
		}

		console.log("interval");

		// now loop through articles and get full data

		for (let category in faqs) {
			for (let subcat in faqs[category]) {
				let articles = faqs[category][subcat]?.articles;
				for (let article of articles) {
					try {
						let fullArticle = await getFaqArt(article);
						// assign full article back to array
						let i = articles.findIndex(
							(a) => a?.articleId === article?.articleId
						);
						articles[i] = fullArticle;
					} catch (error) {
						console.log(
							"someThing went wrong in get Faq Art => ",
							error
						);
					}
				}
			}
		}
		console.log("end");

		return faqs;
	} catch (error) {
		console.log("something went wrong => ", error);
	}
}

// let asdf = await getArti();
// console.log(asdf);
// fs.writeFile("./files/asdf.json", JSON.stringify(asdf), (err) => {
// 	if (err) {
// 		console.log("err=> ", err);
// 		throw err;
// 	}
// 	console.log("asdf.json saved");
// });

/////////////////////////////////////////////////

const generatePDF = async () => {
	const faqJson = JSON.parse(fs.readFileSync("./files/finalFaqs.json"));
	const doc = new pdf();

	for (let category in faqJson) {
		// console.log(category);
		doc.text(`${category}`);
		for (let subcat in faqJson[category]) {
			// console.log("================= ", subcat);
			doc.text(`     ${subcat}`);

			let articles = faqJson[category][subcat]?.articles;
			for (let article of articles) {
				// console.log(`${category} - ${subcat} - ${article?.faqId}`);
				doc.text(`              Question - ${article["vkm:name"]}`);
				doc.text(`              Answer - ${article["articleText"]}`);
				doc.text(`\n`);
			}
		}
	}

	doc.pipe(fs.createWriteStream("test.pdf"));
	doc.end();
};

export default generatePDF;
