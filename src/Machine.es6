var Vbox= core.org.voxsoftware.VirtualBox
var Fs= core.System.IO.Fs
import Os from 'os'
import Path from 'path'
class Machine{
		
	constructor(name, manager){
		this.name= name
		this.manager= manager
	}

	async _internal_adaptors(){
		var props= await this.properties(), search, str, info
		info= await this.info()
		search= "/VirtualBox/GuestInfo/Net/"
		var adaptors=[], index, prop, i, y, adaptor, info1
		for(var id in props){
			if(id.startsWith(search)){
				
				str= id.substring(search.length).split("/")
				if(str.length>1){

					index= str[0]|0
					prop= str[str.length-1]
					adaptor= adaptors[index]
					if(!adaptor){
						adaptors[index]= adaptor= {}
					}
					adaptor[prop]= props[id].value

				}
			}
		}
		
		for(var i=0;i<adaptors.length;i++){
			this._internal_adaptor_networkinfo(adaptors[i], i+1, info)
		}
		return adaptors
	}

	async _internal_adaptor_networkinfo(adaptor,index, info){


		if(info["nic"+index]){
			adaptor.networkType= info["nic"+index]
			adaptor.type= info["nictype"+index]

			if(adaptor.networkType=="hostonly"){
				adaptor.networkName= info["hostonlyadapter"+index]
			}
			else if(adaptor.networkType=="natnetwork"){
				adaptor.networkName= info["nat-network"+index]
			}
			else if(adaptor.networkType=="bridged"){
				adaptor.networkName= info["bridgedadapter"+index]
			}
			else if(adaptor.networkType=="intnet"){
				adaptor.networkName= info["intnet"+index]
			}
			else if(adaptor.networkType=="natnetwork"){
				adaptor.networkName= info["nat-network"+index]
			}
		}
	}


	async adaptors(index){
		var ad=[],adaptors
		adaptors= await this._internal_adaptors()
		for(var i=0;i<adaptors.length;i++){
			if(index== undefined || index==i)
				ad.push(new Vbox.Adaptor(this, i, adaptors[i]))
		}

		if(index!=undefined)
			return ad[0]
		return ad
	}


	async setCpus(number){
		await this.manager.command(["modifyvm", this.name, "--cpus", number])
	}

	async setMemoryMB(number){
		await this.manager.command(["modifyvm", this.name, "--memory", number])
	}


	async info(){
		var result= await this.manager.command(["showvminfo", this.name, "--machinereadable"])
		var id, value, y, Info= {}, prop, props= result.data.split("\n")
		for(var i=0;i<props.length;i++){

			prop= props[i]
			if(prop){
				y= prop.indexOf("=")
				id=prop.substring(0, y).trim()
				value=prop.substring(y+1).trim()

				try{
					if(value.startsWith("\"")){
						value= JSON.parse(value)
						if(value=="off")
							value= false
						else if(value=="on")
							value= true
					}
					else{
						value= value.replace(",", ".")
						value= JSON.parse(value)
					}
				}
				catch(e){
					// VideoMode
				}


				Info[id]= value
			}

		}
		
		return Info

	}



	


	async properties(){

		var i,y, l=0, props={}, prop, current, 
			result= await this.manager.command(["guestproperty","enumerate", this.name])
		
		while(true){

			i= result.data.indexOf("Name:", l)
			if(i<0)
				break

			l=i
			y= result.data.indexOf(",", l)
			current= result.data.substring(i+5, y).trim()
			prop= props[current]=props[current]||{}
			l= y


			i= result.data.indexOf("value:", l)
			if(i<0)
				break

			l=i
			y= result.data.indexOf(",", l)
			current= result.data.substring(i+6, y).trim()
			l= y
			prop.value= current


			i= result.data.indexOf("timestamp:", l)
			if(i<0)
				break

			l=i
			y= result.data.indexOf(",", l)
			current= result.data.substring(i+10, y).trim()
			l= y
			prop.timestamp= current|0


			i= result.data.indexOf("flags:", l)
			if(i<0)
				break

			l=i
			y= result.data.indexOf("\n", l)
			current= result.data.substring(i+6, y).trim()
			l= y
			prop.flags= current



		}


		return props
	}


	async start(){
		await this.manager.command(["startvm", this.name, "--type", "headless"])
	}


	async stop(){
		await this.manager.command(["controlvm", this.name, "poweroff"])
	}

	async pause(){
		await this.manager.command(["controlvm", this.name, "pause"])	
	}

	async resume(){
		await this.manager.command(["controlvm", this.name, "resume"])	
	}

	async save(){
		await this.manager.command(["controlvm", this.name, "savestate"])	
	}


	async exec(options){
		var must = []
	
		must.push('--username')
		must.push(options.user)
		must.push('--password')
		must.push(options.password)
		//must.push('--wait-exit')
		must.push('--wait-stdout')
		must.push('--wait-stderr')
		must.push(options.path)
		if(options.arguments){
			must.push("--")
			for(var i=0;i<options.arguments.length;i++)
				must.push(options.arguments[i])
		}

		//VBoxManage --nologo guestcontrol "My VM" execute --image "/bin/ls" --username foo --passwordfile bar.txt --wait-exit --wait-stdout -- -l /usr
		var args= ["guestcontrol", this.name, "run"].concat(must)
		//vw.log(args.join(" "))
		return await this.manager.command(args)	
	}


	async copyFrom(options){
		var must = []
		//must.push(options.src)
		//must.push(options.dest)
		if(options.user){
			must.push('--username')
			must.push(options.user)
			must.push('--password')
			must.push(options.password)
		}
		must.push('--verbose')
		must.push('--follow')
		must.push('--recursive')

		must.push("--target-directory")
		must.push(options.dest)
		must.push(options.src)

		return await this.manager.command(["guestcontrol", this.name, "copyfrom"].concat(must))	
	}


	async copyTo(options){
		var must = []
		//must.push(options.src)
		//must.push(options.dest)
		if(options.user){
			must.push('--username')
			must.push(options.user)
			must.push('--password')
			must.push(options.password)
		}
		must.push('--verbose')
		must.push('--follow')
		must.push('--recursive')

		must.push("--target-directory")
		must.push(options.dest)
		must.push(options.src)

		var args= ["guestcontrol", this.name, "copyto"].concat(must)
		return await this.manager.command(args)	
	}


	async writeFile(options){
		var temp= Os.tmpdir(), er, result
		var uniqid= new Date().getTime().toString(36) + this.name
		var path= Path.join(temp, uniqid)
		if(!Fs.sync.exists(path))
			Fs.sync.mkdir(path)

		path= Path.join(path, Path.basename(options.dest))
		await Fs.async.writeFile(path, options.content)

		//vw.log(path)
		options.dest= Path.dirname(options.dest)
		options.src= path

		try{
			result= await this.copyTo(options)
		}
		catch(e){
			er= e
		}

		//await Fs.async.unlink(path)
		if(er){
			throw er
		}
		return result

	}


	async sharedFolders(){
		var info= await this.info()
		var folders=[], folder, y, index, prop
		for(var id in info){
			if(id.startsWith("SharedFolder")){
				y= id.indexOf("Mapping")
				index= id.substring(y+7)|0
				index--
				folder= folders[index]

				if(!folder){
					folder=folders[index]={}
				}

				prop= id.substring(12,16)
				if(prop=="Name"){
					folder.name= info[id]
				}
				else if(prop=="Path"){
					folder.path= info[id]
				}

				if(id.substring(16, 23)=="Machine")
					folder.transient=false
				else
					folder.transient=true

			}
		}
		var list= new Vbox.SharedFolderList(this)
		for(var i=0;i<folders.length;i++){
			list.push(folders[i])
		}
		return list
	}




}

export default Machine