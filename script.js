let fileContent;
const CONF_SEPARATOR = "!#";

const readFile = (file) => {
 const reader = new FileReader();
 reader.onload = (event) => {
  fileContent = event.target.result;

  fileContent = parseFileIntoBlocks(fileContent);
  searchString();
 };

 reader.readAsText(file);
};

const parseFileIntoBlocks = (file) => {
 // Parse File into Blocks such as:
 // input:
 // """
 // level1
 //   level2
 //   level2
 //     level3
 // level1
 // level1
 //   level2
 // """
 //
 // output:
 // """
 // [['level1', '  level2', '  level2', '    level3'], ['level1'], ['level1', '  level2']]
 // """
 //
 // TODO: Ultimately, need to do this for all levels

 let content = [];
 let newblock = [];
 let fullcontent = file.split("\r\n");
 for (i = 0; i < fullcontent.length; i++) {
  let line = fullcontent[i];
  newblock.push(line);

  if (i < fullcontent.length - 1) {
   if (!fullcontent[i + 1].startsWith(" ")) {
    content.push(newblock);
    newblock = [];
   }
  } else {
   content.push(newblock);
  }
 }
 return content;
};

const handleFileUpload = (event) => {
 const file = event.target.files[0];
 readFile(file);
};

function printArray(arr) {
 let result = "";

 function x(a) {
  if (typeof a == "object") {
   for (var i = 0; i < a.length; i++) {
    x(a[i]);
   }
  } else {
   result += a + "\n";
  }
 }

 x(arr);

 return result;
}

const searchString = () => {
 const input = document.getElementById("searchInput").value;
 if (!fileContent) {
  document.getElementById("searchResult").innerHTML =
   "Please upload a file first.";
  return;
 }

 if (input === "") {
  document.getElementById("searchResult").innerHTML =
   "<pre>" + printArray(fileContent) + "</pre>";
  return;
 }

 try {
  const regex = new RegExp(input, "g");

  let matchedLines = [];

  fileContent.forEach((element) => {
   element.filter((line) => line.match(regex));

   matchedLines.push(element);
  });

  // console.log(fileContent);
  // const matchedLines = fileContent.filter((line) => {
  //  console.log(line);
  //  return fileContent.match(regex);
  // });

  console.log(matchedLines);

  if (matchedLines.length > 0) {
   const highlightedLines = matchedLines.map((line) =>
    line.replace(regex, `<span class="highlight">$&</span>`)
   );
   document.getElementById("searchResult").innerHTML =
    "<pre>" + highlightedLines.join("\n") + "</pre>";
  } else {
   document.getElementById("searchResult").innerHTML =
    "String not found in the file.";
  }
 } catch (error) {
  document.getElementById("searchResult").innerHTML =
   "Invalid regular expression";
 }

 //   const regex = new RegExp(input, "g");
 //   const lines = fileContent.split("\n");
 //   const matchedLines = lines.filter((line) => line.match(regex));

 //   if (matchedLines.length > 0) {
 //    const highlightedLines = matchedLines.map((line) =>
 //     line.replace(regex, `<span class="highlight">$&</span>`)
 //    );
 //    document.getElementById("searchResult").innerHTML =
 //     "<pre>" + highlightedLines.join("\n") + "</pre>";
 //   } else {
 //    document.getElementById("searchResult").innerHTML =
 //     "String not found in the file.";
 //   }
 //  } catch (error) {
 //   document.getElementById("searchResult").innerHTML =
 //    "Invalid regular expression";
 //  }
};

document
 .getElementById("fileInput")
 .addEventListener("change", handleFileUpload);
document.getElementById("searchInput").addEventListener("input", searchString);
