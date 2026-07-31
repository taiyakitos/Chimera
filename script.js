
        function proximaPagina() {
            // 1. Pega o endereço atual do navegador
            let urlAtual = window.location.href;

            // 2. Remove barras no final da URL para não quebrar o código (ex: /1/ vira /1)
            if (urlAtual.endsWith('/')) {
                urlAtual = urlAtual.slice(0, -1);
            }

            // 3. Pega tudo que está depois da última barra '/'
            let partesUrl = urlAtual.split('/');
            let ultimoSegmento = partesUrl[partesUrl.length - 1];

            // 4. Converte o texto em número inteiro
            let numeroAtual = parseInt(ultimoSegmento, 10);

            // 5. Verifica se o final é realmente um número válido
            if (!isNaN(numeroAtual)) {
                // Soma 1 ao número atual
                let proximoNumero = numeroAtual + 1;
                
                // Substitui o número antigo pelo novo no final da URL
                partesUrl[partesUrl.length - 1] = proximoNumero;
                let novaUrl = partesUrl.join('/');

                // Redireciona o navegador para o novo endereço
                window.location.href = novaUrl;
            } else {
                // Mensagem de aviso caso a URL não termine em número
                alert("O final da URL atual não é um número! Exemplo esperado: https://sitelink/1");
            }
        }

const slideActionQuirk = () => {
	
	// Get quirk_toggle
	const quirk_toggle = document.querySelector("#quirklerToggle")
	
	// For each Quirkler Div
	document.querySelectorAll('.quirkler').forEach(quirkler => {
		
		// Create on and off divs for quirks
		const qOn = document.createElement("div")
		const qOff = document.createElement("div")
		qOn.id =  "quirkleron"
		qOff.id = "quirkleroff"
		if (quirk_toggle.checked) { hideme(qOn) } 
		else { hideme(qOff) }
		
		// Prime Log
		var msgArray = quirkler.innerHTML.split("<br>")
		quirkler.innerHTML = "" // Clear Log
		quirkler.appendChild(qOn)
		quirkler.appendChild(qOff)
		
		const divLogs = [qOff, qOn]
		divLogs.forEach((qDiv, qIndex) => {
			msgArray.forEach((msgWhole, index) => {
				
				msgWhole = cleanText(msgWhole)
				
				// Get Message components
				const msgDiv = document.createElement("div")
				let [handle, msgContent] = msgWhole.split(/:(.*)/s)
				
				// Determine message behaviour
				if (handle[0] == "$") { // Notification shorthand
					msgDiv.appendChild(extendShorthand(msgWhole))
				} else if (!msgContent || handle.includes(" ")) { // Not a chat message
					msgDiv.innerText = msgWhole
				} else { // Is a chat message
					
					// Create MessageLog
					msgDiv.id = handle.toUpperCase().replaceAll("~", "alt").replace(/[^a-zA-Z0-9]/g, "_")
					qDiv.appendChild(msgDiv)
					const quirkStyle = getComputedStyle(msgDiv)
					
					const handleSpan = document.createElement("span")
					handleSpan.className = "qhandle"
					handleSpan.innerText = handle.replaceAll("~", "") + ":"
					handleSpan.style.textTransform = "uppercase"
					
					let msgSpan = document.createElement("span")
					if (qIndex) { // If quirk div
						msgSpan = applyQurik(msgContent, quirkStyle)
					} else {
						msgSpan.innerText = msgContent
					}
					msgSpan.className = "qmessage"
					
					msgDiv.appendChild(handleSpan)
					msgDiv.appendChild(msgSpan)
					
				}
				
				// If empty add linebreak
				if (!msgDiv.innerText) msgDiv.appendChild(document.createElement("br"))
				
				// Append msg div to final div
				qDiv.appendChild(msgDiv)
				
			})
		})
		
	})
}

const cleanText = string => string.replaceAll(/&gt;/g, '>').replaceAll(/&quot;/g, '"').replaceAll(/&apos;/g, "'").replaceAll(/&amp;/g, '&').replaceAll(/&nbsp;/g, ' ')

const pruneQuotes = string => string.trim().replace(/^"|"$/g, "")
const simpleReplaceRepair = string => string.replaceAll("&#44;", ",").replaceAll("&#59;", ";")

const applyQurik = (msg, quirkStyle) => {
	let qurikedSpan = document.createElement("span")
	
	// Simple replace
	const ruleSR = quirkStyle.getPropertyValue('--simpR');
	if (ruleSR) {
		const rules = pruneQuotes(ruleSR).split(";").map(rule => rule.split(","))
		rules.forEach(rule => {
			msg = msg.replaceAll(simpleReplaceRepair(rule[0]), simpleReplaceRepair(rule[1]))
		})
	}
	
	//Quirkmods
	const ruleMod = quirkStyle.getPropertyValue('--quirkmod');
	if (ruleMod){
		var quirkfunction = window[pruneQuotes(ruleMod) + "_quirk"];
		console.log(pruneQuotes(ruleMod) + "_quirk")
		if (typeof quirkfunction === "function") msg = quirkfunction(msg);
	}
	
	// Prefix
	const prefixspan = document.createElement("span")
	prefixspan.className = "prefix"
	const rulePrefix = quirkStyle.getPropertyValue('--prefix');
	if (rulePrefix) prefixspan.innerText = pruneQuotes(rulePrefix);
	
	// Suffix
	const suffixspan = document.createElement("span")
	suffixspan.className = "suffix"
	const ruleSuffix = quirkStyle.getPropertyValue('--suffix');
	if (ruleSuffix) suffixspan.innerText = pruneQuotes(ruleSuffix);
	
	// Assemble qurik
	qurikedSpan.appendChild(prefixspan)
	qurikedSpan.appendChild(document.createTextNode(msg))
	qurikedSpan.appendChild(suffixspan)
	
	return qurikedSpan
}

// --- Quirk mods --- //

// Tav
function Tav_quirk(string) { return string.toUpperCase().replace(/(^\w)|([-\s]\w)/g, match => match.toLowerCase()) }
// Gam
function Gam_quirk(string) {
	let output = ""
	for (var i = 0; i < string.length; i++) {
		output += i%2 ? string[i].toUpperCase() : string[i].toLowerCase()
	}
	return output
}

// --- Notification Shorthand --- //

const shortSyntax = [
	["Pester","-- %1handle %1user began pestering %2handle %2user at %time --"],
	["PesterEnd","-- %1handle %1user ceased pestering %2handle %2user at %time --"],
	["Troll","-- %1handle %1user began trolling %2handle %2user at %time --"],
	["TrollEnd","-- %1handle %1user ceased trolling %2handle %2user at %time --"],
	["Idle","-- %1handle %1user is now an idle chum! --"],
	["Block","-- %1handle %1user blocked %2handle %2user at %time --"],
	["NotRecived","%1handle %1user did not receive message from %2handle %2user"],
	["File",'-- %1handle %1user sent %2handle %2user the file "%title" --'],
	
	["Custom","%1handle %1user%title"],
	
	["Memo","-- %1handle %1user opened memo on board %title --"],
	["MemoRespond","-- %1handle %1user responded to memo --"],
	["MemoClose","-- %1handle %1user closed the memo --"],
	["MemoBan","%1handle %1user banned %2handle %2user from responding to the memo"],
	
	["MemoTense","-- %tense %1handle %1user %time %alttense opened memo on board %title --"],
	["MemoTenseRespond","-- %tense %1handle %1user %time %alttense responded to memo --"],
	["TransTimeline","-- %tense %1handle %1user %time %alttense opened public transtimeline bulletin board %title --"],
]

// OLD FUNCTION NEEDS CLEAN UP
const extendShorthand = (text) => {
	const args = text.substring(1).replace("\n", "").split(" ")
	var arr = shortSyntax.filter( function( el ) { return !!~el.indexOf( args[0] ); });
	
	var users = []
	var tense = ""
	
	var output = arr[0][1]
	var j = 0
	args.forEach((e, i) => {
		//Remove HTML syntax to avoid HTML PUT BBCODE PARSER HERE!!!!!!!!!
		e = e.replaceAll("<", "")
		
		if (i !== 0 && !e.includes(":") && !e.includes("_") && !e.includes("@")) {
			j += 1
			//Create temp div to get style
			var tempDiv = document.createElement("div");
			tempDiv.setAttribute("id", e.replaceAll("^","_").replaceAll("~","alt").replaceAll(" ","_"));
			
			//Add and remove temp div
			document.querySelector('body').appendChild(tempDiv)
			const rule = getComputedStyle(tempDiv);
			const chumhandle = pruneQuotes(rule.getPropertyValue('--chum'));
			const color = rule.getPropertyValue('color');
			document.querySelector('body').removeChild(tempDiv)
			
			//Replace text
			output = output.replace("%" + j + "handle", chumhandle)
			
			//Add tag to list
			var userTag = document.createElement("span");
			userTag.innerText = "[" + tense + e.replaceAll("~","") + "]"
			userTag.style = "color: " + color
			users.push(userTag)
			
			output = output.replace("%" + j + "user", "_____")
		} else if (i !== 0) {
			//Title
			if (e.includes("_")) {
				if (e.charAt(0) == "_") {e = e.replace("_", "")}
				output = output.replace("%title", e.replaceAll("_", " "))
			}
			//Tense
			else if (e.includes("@")) {
				if (e == "@P") {
					output = output.replace("%tense", "PAST")
					output = output.replace("%alttense", "HOURS AGO")
					tense = "P"
				} else if (e == "@C") {
					output = output.replace("%tense", "CURRENT")
					output = output.replace("%alttense", "RIGHT NOW")
					output = output.replace("%time", "")
					tense = "C"
				} else if (e == "@F") {
					output = output.replace("%tense", "FUTURE")
					output = output.replace("%alttense", "HOURS IN THE FUTURE")
					tense = "F"
				} else if (e == "@?") {
					output = output.replace("%tense", "???")
					output = output.replace("%alttense", "")
					output = output.replace("%time", "AT ?:??")
					tense = "?"
				}
			}
			//Time
			else if (e.includes(":")) {
				output = output.replace("%time", e)
			}
		}
	})
	
	//Insert Users
	var tagarr = output.split("_____")
	var outputSpan = document.createElement("span");
	tagarr.forEach((text, i) => {
		outputSpan.appendChild(document.createTextNode(text))
		if (isElement(users[i])) {
			outputSpan.appendChild(users[i])
		}
	})
	
	return outputSpan
}

const isElement = element => element instanceof Element || element instanceof HTMLDocument;  


// --- Create Quirk Toggle --- //
const createQuirkToggle = () => {
	const quirkler_checkbox = document.createElement('input');
	quirkler_checkbox.type = 'checkbox';
	quirkler_checkbox.id = 'quirklerToggle';

	const quirkler_label = document.createElement('label')
	quirkler_label.htmlFor = 'quirkler';
	quirkler_label.appendChild(document.createTextNode('Quirkless mode'));
	quirkler_label.style = 'font-weight: bold';

	const quirkler_br = document.createElement('br');

	const quirkler_container = document.querySelector('.fav.major').parentNode;
	quirkler_container.appendChild(quirkler_checkbox);
	quirkler_container.appendChild(quirkler_label);
	quirkler_container.appendChild(quirkler_br);

	quirkler_checkbox.addEventListener('change', function() {
		if (this.checked) {
			document.querySelectorAll('#quirkleron').forEach(hideme)
			document.querySelectorAll('#quirkleroff').forEach(showme)
		} else {
			document.querySelectorAll('#quirkleron').forEach(showme)
			document.querySelectorAll('#quirkleroff').forEach(hideme)
		}
	});
}

function showme(element) { element.style.display = "block" };
function hideme(element) { element.style.display = "none" };

createQuirkToggle()

//JS input name and save compaitbility
var QnameKeys = []
var Qname = []
var QkeyPrefix = "FlareMSPFA" + MSPFA.story.i

const QupdateNKeys = () => {
  if ((typeof nameKeys !== "undefined") && (nameKeys !== null)) {
    QnameKeys = nameKeys
    Qname = []
    QnameKeys.forEach(key => {
      var keyname = localStorage.getItem(QkeyPrefix + key).toUpperCase()
      keyname = keyname.includes(" ") ? keyname.substring(0, keyname.indexOf(" ")) : keyname
      Qname.push(keyname)
    })
  } 
}

//Activate function
var isNameChange = false
MSPFA.slide.push(() => {
    slideActionQuirk();
    if (isNameChange) { QupdateNKeys() }
    if (document.getElementById("savename")) { isNameChange = true }
});

if (MSPFA.story.i !== 42874) {
    slideActionQuirk()
}

QupdateNKeys()