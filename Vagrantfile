# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

	config.vm.provider "virtualbox" do |v|
		v.name = "angular-dev-fritzapp"
		v.cpus = 4
		v.memory = 2048
		v.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/v-root", "1"]
  	end

	config.vm.box = "ubuntu/trusty32"

	# development server
	config.vm.network "forwarded_port", guest: 8080, host: 8080
	# livereload
	config.vm.network "forwarded_port", guest: 35729, host: 35729
	# karma server
	config.vm.network "forwarded_port", guest: 9876, host: 9876

	config.vm.hostname = "angular"

	config.vm.provision :shell do |shell|
	 	shell.inline = "mkdir -p /etc/puppet/modules;
						puppet module install willdurand/nodejs"
	end

	config.vm.provision "puppet" do |puppet|
		puppet.manifests_path = "puppet"
		puppet.manifest_file  = "base_installation.pp"
   		puppet.options        = "--verbose --debug"
	end
end
