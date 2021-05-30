<?php
	$ip_static1 = getenv('STATIC_APP1');
	$ip_static2 = getenv('STATIC_APP2');
	$ip_dynamic1 = getenv('DYNAMIC_APP1');
	$ip_dynamic2 = getenv('DYNAMIC_APP2');
?>
<Proxy "balancer://mydynamic">
	BalancerMember "http://<?php print $ip_dynamic1 ?>:3000"
	BalancerMember "http://<?php print $ip_dynamic2 ?>:3000"
</Proxy>

<Proxy "balancer://mystatic">
	BalancerMember "http://<?php print $ip_static1 ?>:80" route=1
	BalancerMember "http://<?php print $ip_static2 ?>:80" route=2
	ProxySet stickysession=ROUTEID
</Proxy>
		
<VirtualHost *:80>
        ServerName res.heigvd.ch

	Header add Set-Cookie "ROUTEID=.%{BALANCER_WORKER_ROUTE}e; path=/" env=BALANCER_ROUTE_CHANGED
		
        ProxyPass '/api/companies/' 'balancer://mydynamic/'
        ProxyPassReverse '/api/companies/' 'balancer://mydynamic/'

        ProxyPass '/' 'balancer://mystatic/'
        ProxyPassReverse '/' 'balancer://mystatic/'
</VirtualHost>
