import { Component, OnInit } from '@angular/core';
import { TeamService, TeamsTableHeaders } from '../services/team.service';
import { Observable } from 'rxjs';
import { Team } from '../interfaces/team';
import { take } from 'rxjs/operators';
import { Countries } from '../interfaces/player';

@Component({
  selector: 'app-team-table',
  templateUrl: './team-table.component.html',
  styleUrls: ['./team-table.component.scss']
})
export class TeamTableComponent implements OnInit {

  // El signo pesos representa que teams es una variable asíncrona
  public teams$: Observable<Team[]>;
  public tableHeader = TeamsTableHeaders;
  constructor(private teamService: TeamService) { }

  ngOnInit(): void {
    // Obtenemos los teams
    this.teams$ = this.teamService.getTeams();

    // Obtenemos sólo el primer team
    this.teamService.getTeams().pipe(take(1)).subscribe(teams => {
      if (teams.length === 0) {
        const team: Team = {
          name: 'MyAmazingTeam',
          country: Countries.Mexico,
          players: null
        };
        this.teamService.addTeam(team);
      }
    });

  }

}
