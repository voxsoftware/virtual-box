var fs= core.System.IO.Fs.sync
var fsAsync= core.System.IO.Fs.async
var vbox= core.org.voxsoftware.VirtualBox
import Path from 'path'
import Os from 'os'
import Child from 'child_process'

class Manager{
		
	constructor(){
		this.path= Manager.getPath()
	}


	async ["import"](options){


		if(!options.name)
			throw new core.System.ArgumentException("Debe especificar el parámetro name","options.name")

		await this.command(["import",options.path,"--vsys",'0',"--vmname", options.name])
		return this.machine(options.name)
	}

	get dhcpServers(){
		if(!this.$dhcp)
			this.$dhcp= new vbox.DhcpServers(this)
		return this.$dhcp
	}

	get networks(){
		if(!this.$net)
			this.$net= new vbox.Networks(this)
		return this.$net
	}


	static getPath(){
		var path= process.env.PATH,o
		var win= Os.platform().indexOf("win32")>=0
		var possibles= ["VBoxManage", "VboxManage"]
		var paths= path.split(Path.delimiter)
		for(var i=0;i<paths.length;i++){
			for(var y=0;y<possibles.length;y++){
				o= Path.join(paths[i], possibles[y])
				if(win)
					o+=".exe"

				if(fs.exists(o))
					return o
			}
		}
	}


	machine(name){
		return new vbox.Machine(name, this)
	}


	command(args){

		var pr= Child.spawn(this.path, args), end
		var buffer=[], bufferEr=[], task= new core.VW.Task()
		pr.stdout.on("data", function(b){
			buffer.push(b)
		})
		pr.stderr.on("data", function(b){
			bufferEr.push(b)
		})

		pr.on("error", function(er){
			task.exception= er
			end= true
			task.finish()

		})

		pr.on("exit", function(code){
			if(!end){
				if(code!=0){
					task.exception= new core.System.Exception(Buffer.concat(bufferEr).toString())
				}
				else{
					task.result= {
						"warning":Buffer.concat(bufferEr).toString(),
						"data":Buffer.concat(buffer).toString()
					}
				}

				buffer=undefined
				bufferEr=undefined
				end= true
				task.finish()
				
			}
		})
		return task

	}

	async runningMachines(){
		var machines=[], machine
		var r, y, z, result= await this.command(["list", "runningvms"])
		result= result.data.split("\n")
		if(result.length>0){

			for(var i=0;i<result.length;i++){
				r= result[i]
				if(r){
					y=r.indexOf("\"")
					z=r.lastIndexOf("\"")
					machine= this.machine(r.substring(y+1,z))
					machines.push(machine)
				}
			}	

		}
		return machines

	}
}

export default Manager